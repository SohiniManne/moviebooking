const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WaitingList = sequelize.define('WaitingList', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  movieTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  theaterId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Theaters',
      key: 'id'
    }
  },
  screenId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Screens',
      key: 'id'
    }
  }
}, {
  timestamps: true
});

module.exports = WaitingList; 