import { DataTypes } from "sequelize";
import { sequelize } from "../sequelize.js";

export const Comparison = sequelize.define(
    "Comparison",
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        imdbIds: { type: DataTypes.JSON, allowNull: false },
        titles: { type: DataTypes.JSON, allowNull: false },
        movieCount: { type: DataTypes.INTEGER, allowNull: false },
        comparedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    },
    {
        tableName: "comparisons",
        timestamps: false,
    }
);
