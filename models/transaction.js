'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      transaction.belongsTo(models.trip, {
				as: 'trip',
        foreignKey: {
          name: 'tripId'
        },
			})
      transaction.belongsTo(models.users, {
				as: 'user',
        foreignKey: {
          name: 'userId'
        },
			})
    }
  };
  transaction.init({
    counterQty: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    total: DataTypes.INTEGER,
    status: DataTypes.STRING,
    attachment: DataTypes.STRING,
    tripId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'transaction',
  });
  return transaction;
};