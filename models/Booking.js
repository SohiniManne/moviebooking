const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  seatNumber: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  movieTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('booked', 'cancelled'),
    defaultValue: 'booked'
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

module.exports = Booking; 