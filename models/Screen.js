const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Screen = sequelize.define('Screen', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  type: {
    type: DataTypes.ENUM('Gold', 'Max', 'General'),
    allowNull: false
  },
  totalSeats: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  theaterId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Theaters',
      key: 'id'
    }
  }
}, {
  timestamps: true
});

module.exports = Screen; 