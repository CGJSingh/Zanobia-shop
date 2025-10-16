import React from 'react';

const CSSFogLayer = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Multiple fog layers for depth */}
      <div className="absolute inset-0 animate-fog-pulse">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-400/5 rounded-full blur-3xl animate-fog-drift"></div>
        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-green-400/8 rounded-full blur-2xl animate-fog-drift" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/3 left-1/2 w-72 h-72 bg-green-400/6 rounded-full blur-3xl animate-fog-drift" style={{ animationDelay: '4s' }}></div>
      </div>
      
      <div className="absolute inset-0 animate-fog-pulse" style={{ animationDelay: '1s' }}>
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-green-400/4 rounded-full blur-2xl animate-fog-drift" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-88 h-88 bg-green-400/7 rounded-full blur-3xl animate-fog-drift" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-2/3 right-1/2 w-56 h-56 bg-green-400/5 rounded-full blur-2xl animate-fog-drift" style={{ animationDelay: '5s' }}></div>
      </div>
      
      {/* Subtle gradient overlay for atmospheric effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-400/2 via-transparent to-green-400/3"></div>
    </div>
  );
};

export default CSSFogLayer;
