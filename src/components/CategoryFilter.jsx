import React from 'react';

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  const categoryChips = [
    { id: '', name: 'All Products', color: 'gray' },
    ...categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      color: getCategoryColor(cat.name)
    }))
  ];

  function getCategoryColor(categoryName) {
    const colors = {
      'Hookahs': 'green',
      'Accessories': 'blue',
      'Charcoal': 'orange',
      'Tobacco': 'purple',
      'Parts': 'pink'
    };
    
    return colors[categoryName] || 'gray';
  }

  const getColorClasses = (color, isActive) => {
    const baseClasses = "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105";
    
    if (isActive) {
      const activeClasses = {
        green: "bg-green-500 text-white shadow-lg shadow-green-500/25",
        blue: "bg-blue-500 text-white shadow-lg shadow-blue-500/25",
        orange: "bg-orange-500 text-white shadow-lg shadow-orange-500/25",
        purple: "bg-purple-500 text-white shadow-lg shadow-purple-500/25",
        pink: "bg-pink-500 text-white shadow-lg shadow-pink-500/25",
        gray: "bg-gray-500 text-white shadow-lg shadow-gray-500/25"
      };
      return `${baseClasses} ${activeClasses[color]}`;
    }
    
    const inactiveClasses = {
      green: "bg-gray-800 text-gray-300 hover:bg-green-500/20 hover:text-green-400 border border-gray-700",
      blue: "bg-gray-800 text-gray-300 hover:bg-blue-500/20 hover:text-blue-400 border border-gray-700",
      orange: "bg-gray-800 text-gray-300 hover:bg-orange-500/20 hover:text-orange-400 border border-gray-700",
      purple: "bg-gray-800 text-gray-300 hover:bg-purple-500/20 hover:text-purple-400 border border-gray-700",
      pink: "bg-gray-800 text-gray-300 hover:bg-pink-500/20 hover:text-pink-400 border border-gray-700",
      gray: "bg-gray-800 text-gray-300 hover:bg-gray-500/20 hover:text-gray-400 border border-gray-700"
    };
    
    return `${baseClasses} ${inactiveClasses[color]}`;
  };

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {categoryChips.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={getColorClasses(category.color, selectedCategory === category.id)}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
