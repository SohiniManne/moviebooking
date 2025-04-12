const sequelize = require('../config/database');
const Theater = require('./Theater');
const Screen = require('./Screen');
const Booking = require('./Booking');
const FoodItem = require('./FoodItem');
const WaitingList = require('./WaitingList');

// Theater-Screen Association
Theater.hasMany(Screen, {
  foreignKey: 'theaterId'
});
Screen.belongsTo(Theater, {
  foreignKey: 'theaterId'
});

// Theater-Booking Association
Theater.hasMany(Booking, {
  foreignKey: 'theaterId'
});
Booking.belongsTo(Theater, {
  foreignKey: 'theaterId'
});

// Screen-Booking Association
Screen.hasMany(Booking, {
  foreignKey: 'screenId'
});
Booking.belongsTo(Screen, {
  foreignKey: 'screenId'
});

// Theater-WaitingList Association
Theater.hasMany(WaitingList, {
  foreignKey: 'theaterId'
});
WaitingList.belongsTo(Theater, {
  foreignKey: 'theaterId'
});

// Screen-WaitingList Association
Screen.hasMany(WaitingList, {
  foreignKey: 'screenId'
});
WaitingList.belongsTo(Screen, {
  foreignKey: 'screenId'
});

module.exports = {
  sequelize,
  Theater,
  Screen,
  Booking,
  FoodItem,
  WaitingList
}; 