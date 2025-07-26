import { sequelize } from '../config/db';
import { DataTypes, Model } from "sequelize";
import { Comment } from './comment.model'; // Added import for Comment
import { Post } from './posts.model';
import Sequelize from 'sequelize';

// Define the attributes interface
interface UserAttributes {
    id: string;
    googleID: string | null;
    githubID: string | null;
    email: string | null;
    password: string;
    firstName: string | null;
    lastName: string | null;
    paymentStatus: string | null;
    paymentDate: Date | null;
    isSubscribed: boolean | null;
    tx_Ref: string | null;
    subscriptionAmount: number; 
}

// Creation attributes interface
interface UserCreationAttributes extends Omit<UserAttributes, 'id' | 'subscriptionAmount'> {}

// Extend the Model class
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: string;
    public googleID!: string | null;
    public githubID!: string | null;
    public email!: string | null;
    public password!: string;
    public firstName!: string | null;
    public lastName!: string | null;
    public paymentStatus!: string | null;
    public isSubscribed!: boolean | null;
    public paymentDate!: Date | null;
    public tx_Ref!: string| null;
    public subscriptionAmount!: number; 

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
    id: {
        type: DataTypes.STRING,
        primaryKey: true
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
    paymentStatus: {
        type: DataTypes.ENUM,
        allowNull: true,
        defaultValue: 'Not Paid',
        values: ['Not Paid', 'Initiated', 'Subscribed']
    },
    isSubscribed: {
        type: DataTypes.BOOLEAN,
        defaultValue: 'false',
    },
    paymentDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    tx_Ref: {
        type: DataTypes.STRING,
        allowNull: true
    }, 
    subscriptionAmount: {
        type: DataTypes.NUMBER,
        allowNull: false,
        defaultValue: 10000
    }


},
{
    sequelize,
    tableName: 'users',
    timestamps: true
});

export { User };