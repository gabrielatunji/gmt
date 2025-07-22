import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';
import Post from './posts.model';

const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  postID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: Post,
        key: 'postID'
    },
    onDelete: 'CASCADE'
  },
  body: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'comments',
  timestamps: true,
});

export default Comment