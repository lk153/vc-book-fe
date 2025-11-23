// src/components/CartItem.jsx
import React from 'react';

export default function CartItem({ item, updateCartQuantity }) {
  return (
    <div className="p-6 flex gap-4">
      <img 
        src={item.image} 
        alt={item.title}
        className="w-24 h-32 object-cover rounded-lg"
      />
      <div className="flex-1">
        <h3 className="text-xl font-bold text-gray-800 mb-1">{item.title}</h3>
        <p className="text-gray-600 mb-3">by {item.author}</p>
        <p className="text-lg font-semibold text-blue-600">${item.price}</p>
      </div>
      <div className="flex flex-col items-end justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
            className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded font-bold text-gray-700"
          >
            -
          </button>
          <span className="w-12 text-center font-semibold">{item.quantity}</span>
          <button
            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
            className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded font-bold text-gray-700"
          >
            +
          </button>
        </div>
        <p className="text-xl font-bold text-gray-800">
          ${(item.price * item.quantity).toFixed(2)}
        </p>
      </div>
    </div>
  );
}