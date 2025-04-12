const { Booking, Screen, Theater, FoodItem, WaitingList } = require('../models');

const calculateTotalAmount = (screenType, foodItems) => {
  let total = 0;
  
  // Add food items price
  foodItems.forEach(item => {
    total += item.price * item.quantity;
  });

  // Apply discounts based on screen type
  if (screenType === 'Gold') {
    total *= 0.9; // 10% discount
  } else if (screenType === 'Max') {
    total *= 0.95; // 5% discount
  }

  return total;
};

exports.createBooking = async (req, res) => {
  try {
    const { userName, theaterId, screenId, foodItems, movieTime } = req.body;

    // Check if screen exists and get its type
    const screen = await Screen.findByPk(screenId);
    if (!screen) {
      return res.status(404).json({ message: 'Screen not found' });
    }

    // Check available seats
    const bookedSeats = await Booking.count({
      where: {
        screenId,
        movieTime,
        status: 'booked'
      }
    });

    if (bookedSeats >= screen.totalSeats) {
      // Add to waiting list
      const waitlistEntry = await WaitingList.create({
        userName,
        theaterId,
        screenId,
        movieTime
      });

      return res.status(200).json({
        message: 'Screen is full. Added to waiting list.',
        waitlistId: waitlistEntry.id
      });
    }

    // Calculate total amount
    const foodItemsWithPrices = await Promise.all(
      foodItems.map(async (item) => {
        const foodItem = await FoodItem.findByPk(item.id);
        return {
          ...item,
          price: foodItem.price
        };
      })
    );

    const totalAmount = calculateTotalAmount(screen.type, foodItemsWithPrices);

    // Create booking
    const booking = await Booking.create({
      userName,
      theaterId,
      screenId,
      seatNumber: bookedSeats + 1,
      totalAmount,
      movieTime,
      status: 'booked'
    });

    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating booking' });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if cancellation is allowed (30 minutes before movie)
    const movieTime = new Date(booking.movieTime);
    const now = new Date();
    const timeDiff = movieTime - now;
    const minutesLeft = timeDiff / (1000 * 60);

    if (minutesLeft <= 30) {
      return res.status(400).json({ message: 'Cancellation not allowed within 30 minutes of movie time' });
    }

    // Check waiting list
    const waitingListEntry = await WaitingList.findOne({
      where: {
        theaterId: booking.theaterId,
        screenId: booking.screenId,
        movieTime: booking.movieTime
      },
      order: [['createdAt', 'ASC']]
    });

    if (waitingListEntry) {
      // Create new booking for waiting list entry
      await Booking.create({
        userName: waitingListEntry.userName,
        theaterId: waitingListEntry.theaterId,
        screenId: waitingListEntry.screenId,
        seatNumber: booking.seatNumber,
        totalAmount: booking.totalAmount,
        movieTime: waitingListEntry.movieTime,
        status: 'booked'
      });

      // Remove from waiting list
      await waitingListEntry.destroy();
    }

    // Cancel the booking
    await booking.update({ status: 'cancelled' });

    res.status(200).json({
      message: 'Booking cancelled successfully',
      refundAmount: booking.totalAmount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error cancelling booking' });
  }
};

exports.getBookingDetails = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findByPk(bookingId, {
      include: [
        { model: Theater },
        { model: Screen }
      ]
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching booking details' });
  }
}; 