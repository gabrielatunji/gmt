import swaggerJsdoc from 'swagger-jsdoc';
import { hashPassword } from '../utils/bcrypt';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'GMT API Documentation',
      version: '1.0.0',
      description: 'Comprehensive documentation for the GMT API endpoints.',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token for authentication',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'Unique user ID', example: 1 },
            googleID: { type: 'string', nullable: true, description: 'Google ID', example: '1234567890' },
            githubID: { type: 'string', nullable: true, description: 'GitHub ID', example: 'github_user_id' },
            email: { type: 'string', description: 'User email address', example: 'user@example.com' },
            password: { type: 'string', description: 'User password', example: 'hashed_password' },
            firstName: { type: 'string', description: 'User first name', example: 'John' },
            lastName: { type: 'string', nullable: true, description: 'User last name', example: 'Doe' },
            paymentStatus: { type: 'string', enum: ['Not Paid', 'Initiated', 'Subscribed'], description: 'Payment status', example: 'Subscribed' },
            paymentDate: { type: 'string', format: 'date-time', nullable: true, description: 'Last payment date', example: '2024-01-01T00:00:00.000Z' },
            isSubscribed: { type: 'boolean', description: 'Subscription status', example: true },
            tx_Ref: { type: 'string', nullable: true, description: 'Transaction reference', example: 'tx_ref_123' },
          },
        },
        Post: {
          type: 'object',
          properties: {
            postID: { type: 'string', description: 'Unique post ID', example: 'post_id_123' },
            userID: { type: 'integer', description: 'User ID of the post author', example: 1 },
            title: { type: 'string', description: 'Post title', example: 'My First Post' },
            body: { type: 'string', description: 'Post content', example: 'This is the content of my first post.' },
            attachment: { type: 'string', nullable: true, description: 'URL to the attachment', example: 'http://example.com/attachment.jpg' },
          },
        },
        Comment: {
          type: 'object',
          properties: {
            commentID: { type: 'integer', description: 'Unique comment ID', example: 1 },
            postID: { type: 'string', description: 'Post ID the comment belongs to', example: 'post_id_123' },
            userID: { type: 'integer', description: 'User ID of the commenter', example: 1 },
            body: { type: 'string', description: 'Comment content', example: 'This is a great post!' },
          },
        },
        Admin: {
            type: 'object', 
            properties: {
                id: { type: 'integer', description: 'Unique Admin ID', example: 1},
                email: { type: 'string', description: 'Admin email address', example: 'admin@example.com'},
                password: { type: 'string', desciption: 'Admin password', example: 'password123'}, 
                firstName: { type: 'string', description: 'Admin First Name', example: 'Jill'},
                lastName: { type: 'string', description: 'Admin Last Name', example: 'Doe'}
            }
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string', description: 'Error message', example: 'An error occurred' },
          },
        },
      },
    },
    servers: [
      {
        url: 'http://localhost:2500/api/v1', // Update with your base URL
        description: 'Development server',
      },
    ],
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routers/*.ts'], // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;