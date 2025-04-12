import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaPlus, FaMinus } from 'react-icons/fa';

const Food = () => {
  const [cart, setCart] = useState({});
  const [showCart, setShowCart] = useState(false);

  const foodItems = [
    {
      id: 1,
      name: 'Popcorn',
      description: 'Classic buttered popcorn',
      price: 150,
      image: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=300&h=200&fit=crop'
    },
    {
      id: 2,
      name: 'Nachos',
      description: 'Crispy nachos with cheese sauce',
      price: 200,
      image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=300&h=200&fit=crop'
    },
    {
      id: 3,
      name: 'Soft Drinks',
      description: 'Coca Cola, Sprite, or Fanta',
      price: 100,
      image: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=300&h=200&fit=crop'
    },
    {
      id: 4,
      name: 'Combo Pack',
      description: 'Popcorn + Nachos + 2 Soft Drinks',
      price: 400,
      image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=300&h=200&fit=crop'
    }
  ];

  const updateCart = (itemId, increment) => {
    setCart(prev => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) + (increment ? 1 : -1))
    }));
  };

  const getTotalAmount = () => {
    return Object.entries(cart).reduce((total, [itemId, quantity]) => {
      const item = foodItems.find(item => item.id === parseInt(itemId));
      return total + (item ? item.price * quantity : 0);
    }, 0);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-center mb-8 text-gray-800"
      >
        Food & Beverages
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {foodItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
              <p className="text-gray-600 mb-4">{item.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">₹{item.price}</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateCart(item.id, false)}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded"
                  >
                    <FaMinus />
                  </button>
                  <span className="w-8 text-center">{cart[item.id] || 0}</span>
                  <button
                    onClick={() => updateCart(item.id, true)}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded"
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {Object.values(cart).some(quantity => quantity > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4"
        >
          <div className="container mx-auto flex justify-between items-center">
            <div>
              <span className="text-lg font-bold">Total: ₹{getTotalAmount()}</span>
            </div>
            <button
              onClick={() => setShowCart(true)}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition flex items-center space-x-2"
            >
              <FaShoppingCart />
              <span>Checkout</span>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Food; 