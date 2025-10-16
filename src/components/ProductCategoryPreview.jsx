import React from 'react';
import { Link } from 'react-router-dom';

const ProductCategoryPreview = () => {
  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Our Collections</h2>
          <p className="text-xl text-gray-300">Discover our premium products</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Hookahs Section */}
          <div className="animate-fade-in-up">
            <Link to="/products?category=hookahs" className="group block">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-white/10 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105">
                {/* Glassy Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                
                {/* Animated Background Elements */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-8 left-8 w-24 h-24 bg-gradient-to-br from-green-400/30 to-green-600/30 rounded-full blur-xl animate-float"></div>
                  <div className="absolute bottom-8 right-8 w-32 h-32 bg-gradient-to-br from-blue-400/30 to-blue-600/30 rounded-full blur-xl animate-float-reverse"></div>
                </div>
                
                <div className="aspect-[4/3] relative p-8">
                  {/* Category Cards */}
                  <div className="grid grid-cols-2 gap-4 h-full">
                    <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-md border border-green-400/30 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:rotate-2">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-white/20 rounded-full mb-3 mx-auto flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                          </svg>
                        </div>
                        <span className="text-white font-bold text-sm">Premium</span>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-md border border-blue-400/30 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-rotate-2">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-white/20 rounded-full mb-3 mx-auto flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <span className="text-white font-bold text-sm">Classic</span>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-md border border-purple-400/30 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:rotate-2">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-white/20 rounded-full mb-3 mx-auto flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <span className="text-white font-bold text-sm">Modern</span>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-orange-500/20 to-red-600/20 backdrop-blur-md border border-orange-400/30 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-rotate-2">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-white/20 rounded-full mb-3 mx-auto flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        </div>
                        <span className="text-white font-bold text-sm">Luxury</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content Overlay */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                      <h3 className="text-3xl font-bold text-white mb-2">Premium Hookahs</h3>
                      <p className="text-lg text-gray-300 mb-4">Exquisite collection for the ultimate experience</p>
                      <div className="flex items-center text-green-400 font-semibold group-hover:text-green-300 transition-colors">
                        <span>Explore Collection</span>
                        <svg className="w-5 h-5 ml-2 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Accessories Section */}
          <div className="animate-fade-in-up">
            <Link to="/products?category=accessories" className="group block">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-white/10 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105">
                {/* Glassy Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                
                {/* Animated Background Elements */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-12 right-12 w-28 h-28 bg-gradient-to-br from-purple-400/30 to-purple-600/30 rounded-full blur-xl animate-float"></div>
                  <div className="absolute bottom-12 left-12 w-36 h-36 bg-gradient-to-br from-pink-400/30 to-pink-600/30 rounded-full blur-xl animate-float-reverse"></div>
                </div>
                
                <div className="aspect-[4/3] relative p-8">
                  {/* Accessories Grid */}
                  <div className="grid grid-cols-3 gap-3 h-full">
                    {/* Top Row */}
                    <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-md border border-green-400/30 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:rotate-5"></div>
                    <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-md border border-blue-400/30 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:-rotate-3"></div>
                    <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-md border border-purple-400/30 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:rotate-4"></div>
                    
                    {/* Middle Row */}
                    <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 backdrop-blur-md border border-yellow-400/30 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:-rotate-2"></div>
                    <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 backdrop-blur-md border border-red-400/30 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:rotate-3"></div>
                    <div className="bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 backdrop-blur-md border border-indigo-400/30 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:-rotate-4"></div>
                    
                    {/* Bottom Row */}
                    <div className="bg-gradient-to-br from-pink-500/20 to-pink-600/20 backdrop-blur-md border border-pink-400/30 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:rotate-2"></div>
                    <div className="bg-gradient-to-br from-teal-500/20 to-teal-600/20 backdrop-blur-md border border-teal-400/30 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:-rotate-5"></div>
                    <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-md border border-orange-400/30 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:rotate-3"></div>
                  </div>
                  
                  {/* Content Overlay */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                      <h3 className="text-3xl font-bold text-white mb-2">Premium Accessories</h3>
                      <p className="text-lg text-gray-300 mb-4">Essential components for your setup</p>
                      <div className="flex items-center text-green-400 font-semibold group-hover:text-green-300 transition-colors">
                        <span>Explore Accessories</span>
                        <svg className="w-5 h-5 ml-2 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductCategoryPreview;