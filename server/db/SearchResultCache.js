const conn = require("./conn");
const { DATE, INTEGER, JSONB, STRING } = conn.Sequelize;

const SearchResultCache = conn.define(
  "searchResultCache",
  {
    key: {
      type: STRING,
      primaryKey: true,
    },
    actorLowId: {
      type: INTEGER,
      allowNull: false,
    },
    actorHighId: {
      type: INTEGER,
      allowNull: false,
    },
    algorithmVersion: {
      type: STRING,
      allowNull: false,
    },
    response: {
      type: JSONB,
      allowNull: false,
    },
    expiresAt: {
      type: DATE,
      allowNull: false,
    },
    lastAccessedAt: {
      type: DATE,
      allowNull: false,
    },
  },
  {
    tableName: "search_result_cache",
    indexes: [{ fields: ["expiresAt"] }],
  }
);

module.exports = SearchResultCache;
