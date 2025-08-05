import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';
import { Post } from './posts.model';
import { User } from './user.model';
import Sequelize from 'sequelize';

interface CommentAttributes {
    commentID: number;
    postID: string;
    userID: string;
    body: string;
}

interface CommentCreationAttributes extends Omit<CommentAttributes, 'commentID'> {}

class Comment extends Model<CommentAttributes, CommentCreationAttributes> implements CommentAttributes {
    public commentID!: number;
    public postID!: string;
    public userID!: string;
    public body!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public getUser!: Sequelize.BelongsToGetAssociationMixin<User>;
}

Comment.init({
    commentID: {
    type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
  },
    postID: { 
    type: DataTypes.STRING, 
    allowNull: false,
    references: {
            model: Post, // Reference the Post model
            key: 'postID'
    },
        onDelete: 'CASCADE' // Cascade delete if post is deleted
  },
    userID: { // Foreign key for User
    type: DataTypes.STRING,
    allowNull: false,
        references: {
            model: User, // Reference the User model
            key: 'userID' 
  }
    },
    body: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
  tableName: 'comments',
  timestamps: true,
});


// Comment.belongsTo(User, { foreignKey: 'userID', as: 'commenter' });

export { Comment };

