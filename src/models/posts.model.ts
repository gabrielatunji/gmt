import { sequelize } from '../config/db';
import { DataTypes, Model } from "sequelize";
import { User } from './user.model';
import { Comment } from './comment.model';
import Sequelize from 'sequelize';

// Define the attributes interface
interface PostAttributes {
    postID: string; 
    userID: string; 
    title: string;
    body: string;
    attachment: string | null;
    tags: string[] | null;
}

// Creation attributes interface - postID is NOT omitted
interface PostCreationAttributes extends PostAttributes {}

// Extend the Model class
class Post extends Model<PostAttributes, PostCreationAttributes> implements PostAttributes {
    public postID!: string; 
    public userID!: string; 
    public title!: string;
    public body!: string;
    public attachment!: string | null;
    public tags!: string[] | null;

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
    public removeComments!: Sequelize.HasManyRemoveAssociationMixin<Comment, number>;
    public setComments!: Sequelize.HasManySetAssociationsMixin<Comment, number>;


    public readonly comments?: Comment[]; // optional since it's an eager load
}

Post.init({
    postID: {
        type: DataTypes.STRING, 
        allowNull: false, 
        primaryKey: true,
    },
    userID: { 
        type: DataTypes.STRING, 
        allowNull: false,
        references: {
            model: User, // Reference the User model for foreign key
            key: 'userID'  
        }
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    body: {
        type: DataTypes.STRING,
        allowNull: false
    },
    attachment: {
        type: DataTypes.STRING,
        allowNull: true
    },
    tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true
    }
},
{
    sequelize,
    tableName: 'posts',
    timestamps: true
});

// Define the association (one-to-many: User has many Posts)
// Post.belongsTo(User, { foreignKey: 'userID', as: 'author' }); // Added as: 'author'
// Post.hasMany(Comment, { foreignKey: 'postID', as: 'comments' });

export { Post };

