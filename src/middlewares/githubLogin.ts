import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid'; 
import { v7 as uuidv7 } from 'uuid';
import { User } from '../models/user.model';

dotenv.config();

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    callbackURL: "/auth/github/callback",  // Your callback URL
    scope: ['user:email'], // Request email access
    passReqToCallback: true
},
    async ( profile: any, done: any) => {
        try {
            const existingUser = await User.findOne({ where: { githubID: profile.id } });

            if (existingUser) {
                // User already exists
                return done(null, existingUser);
            } else {
                // GitHub doesn't always provide email, handle the case where it's missing
                const email = profile.emails?.[0].value;
                const randomPassword = uuidv4(); 
                const userID = 'user-'+uuidv7();


               const newUser = await User.create({
                    userID: userID,
                    githubID: profile.id,
                    firstName: profile.displayName ? profile.displayName.split(' ')[0] : 'Github User', // Use displayName if available
                    lastName: profile.displayName ? profile.displayName.split(' ').slice(1).join(' ') : '',
                    email: email ? email: null,
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
    done(null, user.id); // Use the user's ID from your database
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