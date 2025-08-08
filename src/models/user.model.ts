import { sequelize } from '../config/db';
import { DataTypes, Model } from "sequelize";
import { Comment } from './comment.model'; // Added import for Comment
import { Post } from './posts.model';
import Sequelize from 'sequelize';

// Define the attributes interface
interface UserAttributes {
    userID: string;
    googleID: string | null;
    githubID: string | null;
    email: string;
    password: string;
    firstName: string;
    lastName: string | null;
    bio: string | null;
    profilePicture: string | null;
    isSubscribed: boolean | null;
    paymentTxRef: string | null;
    nextSubscription: Date | null;
}

// Creation attributes interface
interface UserCreationAttributes extends UserAttributes {}

// Extend the Model class
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public userID!: string;
    public googleID!: string | null;
    public githubID!: string | null;
    public email!: string;
    public password!: string;
    public firstName!: string;
    public lastName!: string | null;
    public bio!: string | null;
    public profilePicture!: string | null;
    public isSubscribed!: boolean | null;
    public paymentTxRef!: string | null;
    public nextSubscription!: Date | null;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public getComments!: Sequelize.HasManyGetAssociationsMixin<Comment>;
    public createComment!: Sequelize.HasManyCreateAssociationMixin<Comment>;
    public hasComment!: Sequelize.HasManyHasAssociationMixin<Comment, number>;
    public countComments!: Sequelize.HasManyCountAssociationsMixin;
    public addComment!: Sequelize.HasManyAddAssociationMixin<Comment, number>;
    public addComments!: Sequelize.HasManyAddAssociationsMixin<Comment, number>;
    public removeComment!: Sequelize.HasManyRemoveAssociationMixin<Comment, number>;
    public removeComments!: Sequelize.HasManyRemoveAssociationsMixin<Comment, number>;
    public setComments!: Sequelize.HasManySetAssociationsMixin<Comment, number>;
    public getPosts!: Sequelize.HasManyGetAssociationsMixin<Post>;
    public createPost!: Sequelize.HasManyCreateAssociationMixin<Post>;
    public hasPost!: Sequelize.HasManyHasAssociationMixin<Post, number>;
    public countPosts!: Sequelize.HasManyCountAssociationsMixin;
    public addPost!: Sequelize.HasManyAddAssociationMixin<Post, number>;
    public addPosts!: Sequelize.HasManyAddAssociationsMixin<Post, number>;
    public removePost!: Sequelize.HasManyRemoveAssociationMixin<Post, number>;
    public removePosts!: Sequelize.HasManyRemoveAssociationsMixin<Post, number>;
    public setPosts!: Sequelize.HasManySetAssociationsMixin<Post, number>;

    public readonly comments?: Comment[]; // optional for eager load
    public readonly posts?: Post[];
}

User.init({
    userID: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    googleID: {
        type: DataTypes.STRING,
        allowNull: true
    },
    githubID: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull:false
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    bio: {
        type: DataTypes.STRING,
        allowNull: true
    },
    profilePicture: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isSubscribed: {
        type: DataTypes.BOOLEAN,
        defaultValue: 'false',
    },
    paymentTxRef: {
        type: DataTypes.STRING,
        allowNull: true
    },
    nextSubscription: {
        type: DataTypes.DATE,
        allowNull: true
    }

},
{
    sequelize,
    tableName: 'users',
    timestamps: true
});

User.hasMany(Post, {
  foreignKey: 'userID',
  as: 'posts'
});
User.hasMany(Comment, {
    foreignKey: 'userID',
    as: 'comments'
});

export { User };