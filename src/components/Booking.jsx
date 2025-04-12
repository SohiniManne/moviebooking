import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import FoodSelection from './FoodSelection';

const Booking = () => {
    const { movieId } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [showtimes, setShowtimes] = useState([]);
    const [screenTypes, setScreenTypes] = useState([]);
    const [selectedShowtime, setSelectedShowtime] = useState(null);
    const [selectedScreenType, setSelectedScreenType] = useState(null);
    const [numTickets, setNumTickets] = useState(1);
    const [selectedFood, setSelectedFood] = useState({});
    const [totalFoodPrice, setTotalFoodPrice] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [movieResponse, showtimesResponse, screenTypesResponse] = await Promise.all([
                    axios.get(`http://localhost:3000/api/movies/${movieId}`),
                    axios.get(`http://localhost:3000/api/showtimes/movie/${movieId}`),
                    axios.get('http://localhost:3000/api/booking/screen-types')
                ]);

                setMovie(movieResponse.data);
                setShowtimes(showtimesResponse.data);
                setScreenTypes(screenTypesResponse.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [movieId]);

    const handleFoodSelection = (items, totalPrice) => {
        setSelectedFood(items);
        setTotalFoodPrice(totalPrice);
    };

    const handleBooking = async () => {
        if (!selectedShowtime || !selectedScreenType) {
            alert('Please select a showtime and screen type');
            return;
        }

        try {
            const foodItems = Object.entries(selectedFood)
                .filter(([_, quantity]) => quantity > 0)
                .map(([id, quantity]) => ({
                    food_item_id: parseInt(id),
                    quantity
                }));

            const response = await axios.post(
                'http://localhost:3000/api/booking/create',
                {
                    showtime_id: selectedShowtime.id,
                    screen_type: selectedScreenType,
                    num_tickets: numTickets,
                    food_items: foodItems
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            alert('Booking successful!');
            navigate('/my-bookings');
        } catch (error) {
            console.error('Error creating booking:', error);
            alert('Error creating booking. Please try again.');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    const calculateTotalPrice = () => {
        if (!selectedScreenType) return 0;
        const screen = screenTypes.find(s => s.screen_type === selectedScreenType);
        if (!screen) return 0;
        return (screen.price_per_ticket * numTickets) + totalFoodPrice;
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Book Tickets for {movie?.title}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Showtime Selection */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">Select Showtime</h2>
                    <div className="space-y-4">
                        {showtimes.map((showtime) => (
                            <button
                                key={showtime.id}
                                onClick={() => setSelectedShowtime(showtime)}
                                className={`w-full p-4 border rounded-lg text-left ${
                                    selectedShowtime?.id === showtime.id
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'hover:border-blue-300'
                                }`}
                            >
                                <div className="font-semibold">
                                    {new Date(showtime.show_date).toLocaleDateString()}
                                </div>
                                <div className="text-gray-600">
                                    {new Date(`2000-01-01T${showtime.show_time}`).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                                <div className="text-sm text-gray-500">
                                    Available Seats: {showtime.available_seats}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Screen Type Selection */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">Select Screen Type</h2>
                    <div className="space-y-4">
                        {screenTypes.map((screen) => (
                            <button
                                key={screen.id}
                                onClick={() => setSelectedScreenType(screen.screen_type)}
                                className={`w-full p-4 border rounded-lg text-left ${
                                    selectedScreenType === screen.screen_type
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'hover:border-blue-300'
                                }`}
                            >
                                <div className="font-semibold">{screen.screen_type}</div>
                                <div className="text-gray-600">₹{screen.price_per_ticket} per ticket</div>
                                <div className="text-sm text-gray-500">
                                    {screen.total_seats} seats available
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Number of Tickets */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">Number of Tickets</h2>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setNumTickets(Math.max(1, numTickets - 1))}
                            className="px-4 py-2 bg-gray-200 rounded"
                        >
                            -
                        </button>
                        <span className="text-xl">{numTickets}</span>
                        <button
                            onClick={() => setNumTickets(numTickets + 1)}
                            className="px-4 py-2 bg-gray-200 rounded"
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* Food Selection */}
                {selectedScreenType && (
                    <FoodSelection
                        screenType={selectedScreenType}
                        onFoodSelection={handleFoodSelection}
                    />
                )}
            </div>

            {/* Total Price and Book Button */}
            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold">Total Price</h2>
                        <p className="text-3xl font-bold text-blue-600">
                            ₹{calculateTotalPrice()}
                        </p>
                    </div>
                    <button
                        onClick={handleBooking}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Book Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Booking; 