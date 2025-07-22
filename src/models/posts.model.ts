import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db';
import Comment from './comment.model';

const Post = sequelize.define('Post', {
  postID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  body: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  attachment: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  tableName: 'posts',
  timestamps: true,
});

export default Post 