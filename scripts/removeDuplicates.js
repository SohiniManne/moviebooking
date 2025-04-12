const { sequelize, Theater, Screen, Booking, WaitingList } = require('../models');

async function initializeDatabase() {
  try {
    // Sync all models with the database
    await sequelize.sync();
    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Error synchronizing database:', error);
    process.exit(1);
  }
}

async function removeDuplicates() {
  try {
    // Initialize database first
    await initializeDatabase();

    // Remove duplicate theaters
    const theaters = await Theater.findAll({
      order: [['createdAt', 'ASC']]
    });
    const uniqueTheaters = new Map();
    const duplicateTheaterIds = [];
    theaters.forEach(theater => {
      const key = `${theater.name}-${theater.location}`;
      if (!uniqueTheaters.has(key)) {
        uniqueTheaters.set(key, theater);
      } else {
        duplicateTheaterIds.push(theater.id);
      }
    });

    // Remove duplicate screens
    const screens = await Screen.findAll({
      order: [['createdAt', 'ASC']]
    });
    const uniqueScreens = new Map();
    const duplicateScreenIds = [];
    screens.forEach(screen => {
      const key = `${screen.theaterId}-${screen.name}`;
      if (!uniqueScreens.has(key)) {
        uniqueScreens.set(key, screen);
      } else {
        duplicateScreenIds.push(screen.id);
      }
    });

    // Remove duplicate bookings
    const bookings = await Booking.findAll({
      order: [['createdAt', 'ASC']]
    });
    const uniqueBookings = new Map();
    const duplicateBookingIds = [];
    bookings.forEach(booking => {
      const key = `${booking.theaterId}-${booking.screenId}-${booking.showTime}-${booking.seatNumber}`;
      if (!uniqueBookings.has(key)) {
        uniqueBookings.set(key, booking);
      } else {
        duplicateBookingIds.push(booking.id);
      }
    });

    // Remove duplicate waiting list entries
    const waitingList = await WaitingList.findAll({
      order: [['createdAt', 'ASC']]
    });
    const uniqueWaitingList = new Map();
    const duplicateWaitingListIds = [];
    waitingList.forEach(entry => {
      const key = `${entry.theaterId}-${entry.screenId}-${entry.showTime}-${entry.customerEmail}`;
      if (!uniqueWaitingList.has(key)) {
        uniqueWaitingList.set(key, entry);
      } else {
        duplicateWaitingListIds.push(entry.id);
      }
    });

    // Delete duplicates
    const results = await Promise.all([
      duplicateTheaterIds.length > 0 ? Theater.destroy({ where: { id: duplicateTheaterIds } }) : 0,
      duplicateScreenIds.length > 0 ? Screen.destroy({ where: { id: duplicateScreenIds } }) : 0,
      duplicateBookingIds.length > 0 ? Booking.destroy({ where: { id: duplicateBookingIds } }) : 0,
      duplicateWaitingListIds.length > 0 ? WaitingList.destroy({ where: { id: duplicateWaitingListIds } }) : 0
    ]);

    console.log('Duplicate removal results:');
    console.log(`- Theaters: ${results[0]} duplicates removed`);
    console.log(`- Screens: ${results[1]} duplicates removed`);
    console.log(`- Bookings: ${results[2]} duplicates removed`);
    console.log(`- Waiting List: ${results[3]} duplicates removed`);

    await sequelize.close();
  } catch (error) {
    console.error('Error removing duplicates:', error);
    await sequelize.close();
  }
}

removeDuplicates(); 