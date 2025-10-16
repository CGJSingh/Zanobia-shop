import React, { useRef, useEffect, useState } from 'react';

const SmokeBackground = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMouseMoving, setIsMouseMoving] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const mouseTimeoutRef = useRef(null);

  useEffect(() => {
    // Check if mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse movement handler
    const handleMouseMove = (e) => {
      if (isMobile) return;
      
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsMouseMoving(true);
      
      // Clear existing timeout
      if (mouseTimeoutRef.current) {
        clearTimeout(mouseTimeoutRef.current);
      }
      
      // Set timeout to fade glow after 1.5 seconds
      mouseTimeoutRef.current = setTimeout(() => {
        setIsMouseMoving(false);
      }, 1500);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    let time = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create large green-tinted smoke layers
      for (let layer = 0; layer < 4; layer++) {
        const opacity = 0.08 - (layer * 0.015); // More visible smoke
        const size = 300 + (layer * 150); // Larger smoke areas
        const speed = 0.3 + (layer * 0.2);
        
        // Create multiple smoke patches across the screen
        for (let i = 0; i < 12; i++) {
          const x = (canvas.width / 12) * i + Math.sin(time * speed + i * 0.5) * 80;
          const y = canvas.height / 2 + Math.cos(time * speed * 0.6 + i * 0.3) * 60;
          
          // Green-tinted radial gradient for smoke
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
          gradient.addColorStop(0, `rgba(139, 198, 63, ${opacity * 0.3})`); // Green tint
          gradient.addColorStop(0.3, `rgba(139, 198, 63, ${opacity * 0.2})`);
          gradient.addColorStop(0.6, `rgba(200, 200, 200, ${opacity * 0.1})`);
          gradient.addColorStop(1, `rgba(100, 100, 100, 0)`);
          
          ctx.fillStyle = gradient;
          ctx.fillRect(x - size, y - size, size * 2, size * 2);
        }
      }
      
      // Add floating smoke particles
      for (let i = 0; i < 8; i++) {
        const particleX = (canvas.width / 8) * i + Math.sin(time * 0.4 + i) * 100;
        const particleY = canvas.height * 0.3 + Math.cos(time * 0.3 + i * 0.7) * 40;
        const particleSize = 60 + Math.sin(time * 0.5 + i) * 20;
        
        const particleGradient = ctx.createRadialGradient(
          particleX, particleY, 0,
          particleX, particleY, particleSize
        );
        particleGradient.addColorStop(0, 'rgba(139, 198, 63, 0.15)');
        particleGradient.addColorStop(0.5, 'rgba(139, 198, 63, 0.08)');
        particleGradient.addColorStop(1, 'rgba(139, 198, 63, 0)');
        
        ctx.fillStyle = particleGradient;
        ctx.fillRect(
          particleX - particleSize,
          particleY - particleSize,
          particleSize * 2,
          particleSize * 2
        );
      }
      
      // Enhanced mouse-following glow effect
      if (isMouseMoving && !isMobile) {
        const glowSize = 400;
        const glowIntensity = 0.2;
        
        // Main glow
        const glowGradient = ctx.createRadialGradient(
          mousePosition.x, mousePosition.y, 0,
          mousePosition.x, mousePosition.y, glowSize
        );
        glowGradient.addColorStop(0, `rgba(139, 198, 63, ${glowIntensity})`);
        glowGradient.addColorStop(0.4, `rgba(139, 198, 63, ${glowIntensity * 0.6})`);
        glowGradient.addColorStop(0.7, `rgba(139, 198, 63, ${glowIntensity * 0.3})`);
        glowGradient.addColorStop(1, 'rgba(139, 198, 63, 0)');
        
        ctx.fillStyle = glowGradient;
        ctx.fillRect(
          mousePosition.x - glowSize,
          mousePosition.y - glowSize,
          glowSize * 2,
          glowSize * 2
        );
        
        // Inner bright core
        const coreSize = 150;
        const coreGradient = ctx.createRadialGradient(
          mousePosition.x, mousePosition.y, 0,
          mousePosition.x, mousePosition.y, coreSize
        );
        coreGradient.addColorStop(0, 'rgba(139, 198, 63, 0.4)');
        coreGradient.addColorStop(0.5, 'rgba(139, 198, 63, 0.2)');
        coreGradient.addColorStop(1, 'rgba(139, 198, 63, 0)');
        
        ctx.fillStyle = coreGradient;
        ctx.fillRect(
          mousePosition.x - coreSize,
          mousePosition.y - coreSize,
          coreSize * 2,
          coreSize * 2
        );
      }
      
      time += 0.008; // Slower, more realistic movement
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (mouseTimeoutRef.current) {
        clearTimeout(mouseTimeoutRef.current);
      }
    };
  }, [mousePosition, isMouseMoving, isMobile]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
};

export default SmokeBackground;
