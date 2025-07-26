import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import { User } from '../models/user.model';
import { v4 as uuidv4} from 'uuid'; 

dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: "/auth/google/callback",
    passReqToCallback: true
},
    async (req: any, accessToken: string, refreshToken: string, profile: any, done: any) => {
        const randomPassword = uuidv4(); 
        try {
            const existingUser = await User.findOne({ where: { googleID: profile.id } });
            const userId = uuidv4();


            if (existingUser) {
                return done(null, existingUser);
            } else {
                const newUser = await User.create({
                    googleID: profile.id,
                    firstName: profile.name?.givenName,
                    lastName: profile.name?.familyName,
                    email: profile.emails?.[0]?.value,
                    password: randomPassword
                });
                return done(null, newUser);
            }
        } catch (error) {
            return done(error);
        }
    }
));

passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await User.findByPk(id);
        if (user) {
            done(null, user);
        } else {
            done(null, false);
        }
    } catch (error) {
        done(error);
    }
});

export default passport;