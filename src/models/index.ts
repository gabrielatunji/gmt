import { Post } from './posts.model';
import { Comment } from './comment.model';
import { User } from './user.model';

// Define Associations
Post.hasMany(Comment, { foreignKey: 'postID', as: 'comments' });
Comment.belongsTo(Post, { foreignKey: 'postID', as: 'post' });

User.hasMany(Comment, { foreignKey: 'userID', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'userID', as: 'commenter' });

Post.belongsTo(User, {foreignKey: 'userID', as: 'author'});
User.hasMany(Post, {foreignKey: "userID", as: "posts"}); 


export { Post, Comment, User };

