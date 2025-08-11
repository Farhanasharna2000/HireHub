"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function NotFound() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div 
          className="absolute w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"
          style={{
            left: `${mousePosition.x * 0.1}%`,
            top: `${mousePosition.y * 0.1}%`,
            transform: `translate(-50%, -50%)`,
            transition: 'all 0.3s ease-out'
          }}
        />
        <div 
          className="absolute w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"
          style={{
            right: `${mousePosition.x * 0.05}%`,
            bottom: `${mousePosition.y * 0.05}%`,
            transform: `translate(50%, 50%)`,
            transition: 'all 0.5s ease-out',
            animationDelay: '1s'
          }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className={`relative z-10 min-h-screen flex flex-col items-center justify-center text-white p-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        
        {/* 404 with glitch effect */}
        <div className="relative mb-8">
          <h1 className="text-9xl md:text-[12rem] font-black mb-4 relative">
            <span className="relative z-10 bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
              404
            </span>
            <span className="absolute top-0 left-0 text-9xl md:text-[12rem] font-black text-red-500 opacity-30 animate-ping" style={{animationDuration: '3s'}}>
              404
            </span>
          </h1>
        </div>

        {/* Error message with typewriter effect */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold pb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Page Not Found
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-2 max-w-2xl">
            Sorry, we can't find this page.
          </p>
          <p className="md:text-lg text-gray-400 max-w-xl">
            Let's get you back to where you need to be.
          </p>
        </div>



        {/* Action buttons */}
        <div className="flex  gap-4 items-center">
          <Link 
            href="/"
            className="group relative px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"
          >
            <span className="relative z-10">Go Home</span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="group px-4 py-2 border-2 border-white/30 rounded-full text-white font-semibold text-lg transition-all duration-300 hover:border-white hover:bg-white/10 transform hover:scale-105"
          >
            Go Back
          </button>
        </div>

        {/* Fun fact */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-400 italic">
            Don't worry - this happens to everyone! 
          </p>
        </div>
      </div>

      {/* Custom CSS animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(5deg); }
          66% { transform: translateY(-10px) rotate(-3deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}