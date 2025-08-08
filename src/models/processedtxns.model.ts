import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db";

interface ProcessedTxnsAttributes {
  id: number;
  txRef: string;
  userID: string; 
}

// Creation attributes interface
interface ProcessedTxnsCreationAttributes extends Optional<ProcessedTxnsAttributes, "id"> {}

// Extend the Model class
class ProcessedTransaction extends Model<ProcessedTxnsAttributes, ProcessedTxnsCreationAttributes> implements ProcessedTxnsAttributes {
  public id!: number;
  public txRef!: string;
  public userID!: string;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ProcessedTransaction.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    txRef: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    userID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "processedTransactions",
    timestamps: true,
  }
);


export { ProcessedTransaction };

