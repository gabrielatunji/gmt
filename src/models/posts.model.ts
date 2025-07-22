import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db';

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  body: {
    type: DataTypes.STRING,
    allowNull: false
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