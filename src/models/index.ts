import Post from '../models/posts.model';
import Comment from '../models/comment.model';


Post.hasMany(Comment, { foreignKey: 'postID', as: 'comments' });
Comment.belongsTo(Post, { foreignKey: 'postID', as: 'post' });

export { Post, Comment };
