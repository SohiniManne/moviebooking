import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FoodSelection = ({ screenType, onFoodSelection }) => {
    const [foodItems, setFoodItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFoodItems = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/booking/food-items');
                setFoodItems(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching food items:', error);
                setLoading(false);
            }
        };

        fetchFoodItems();
    }, []);

    const handleQuantityChange = (itemId, quantity) => {
        const newSelectedItems = { ...selectedItems, [itemId]: quantity };
        setSelectedItems(newSelectedItems);
        
        // Calculate total food price with discounts
        const totalFoodPrice = foodItems.reduce((total, item) => {
            const quantity = newSelectedItems[item.id] || 0;
            let price = item.price * quantity;
            
            // Apply discounts based on screen type
            if (screenType === 'Gold') {
                price *= 0.9; // 10% discount
            } else if (screenType === 'Max') {
                price *= 0.95; // 5% discount
            }
            
            return total + price;
        }, 0);

        onFoodSelection(newSelectedItems, totalFoodPrice);
    };

    if (loading) {
        return <div>Loading food items...</div>;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Food & Beverages</h2>
            <div className="space-y-4">
                {foodItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <h3 className="font-semibold">{item.name}</h3>
                            <p className="text-gray-600">₹{item.price}</p>
                            {screenType === 'Gold' && (
                                <p className="text-green-600 text-sm">10% discount applied</p>
                            )}
                            {screenType === 'Max' && (
                                <p className="text-green-600 text-sm">5% discount applied</p>
                            )}
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => handleQuantityChange(item.id, (selectedItems[item.id] || 0) - 1)}
                                disabled={!selectedItems[item.id]}
                                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                            >
                                -
                            </button>
                            <span>{selectedItems[item.id] || 0}</span>
                            <button
                                onClick={() => handleQuantityChange(item.id, (selectedItems[item.id] || 0) + 1)}
                                className="px-3 py-1 bg-gray-200 rounded"
                            >
                                +
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FoodSelection; 