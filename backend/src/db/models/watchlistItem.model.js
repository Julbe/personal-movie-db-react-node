import { DataTypes } from "sequelize";
import { sequelize } from "../sequelize.js";

export const WatchlistItem = sequelize.define(
    "WatchlistItem",
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

        imdbId: { type: DataTypes.STRING, allowNull: false, unique: true },

        myRating: { type: DataTypes.INTEGER, allowNull: true, defaultValue: null }, // 1-10 o null
        watched: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },

        dateAdded: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        lastUpdated: { type: DataTypes.DATE, allowNull: true },
    },
    {
        tableName: "watchlist_items",
        timestamps: false,
        indexes: [{ unique: true, fields: ["imdbId"] }],
    }
);