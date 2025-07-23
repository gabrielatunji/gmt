import { sequelize } from "../config/db";
import { DataTypes, Model } from "sequelize";

// Define the attributes interface
interface AdminAttributes {
    id: number;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
}

// Creation attributes interface
interface AdminCreationAttributes extends Omit<AdminAttributes, 'id' | 'role'> {}


// Extend the Model class
class Admin extends Model<AdminAttributes, AdminCreationAttributes> implements AdminAttributes {
    public id!: number;
    public email!: string;
    public password!: string;
    public firstName!: string;
    public lastName!: string;
    public role!: string;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Admin.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull:false
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'ADMIN'
    }
},
{
    sequelize,
    tableName: 'admins',
    timestamps: true
});

export {Admin}


// import { sequelize } from "../config/db";
// import { DataTypes } from "sequelize";

// const Admin = sequelize.define('Admin', {
//     id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true
//     }, 
//     email: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     password: {
//         type: DataTypes.STRING,
//         allowNull:false
//     }, 
//     firstName: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     lastName: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     role: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         defaultValue: 'ADMIN'
//     }
// }, 
// {
//     tableName: 'admins',
//     timestamps: true
// }); 


// export default Admin 



