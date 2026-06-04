import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

const ConstellationBackground = () => {
  const canvasRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let particles = [];
    let animationFrameId;
    let mouse = { x: null, y: null, radius: 150 };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener('resize', resize);
    
    const handlePointerMove = (e) => {
      if (e.touches && e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
      } else {
        mouse.x = e.x;
        mouse.y = e.y;
      }
    };
    
    const handlePointerOut = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseout', handlePointerOut);
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerOut);

    class Particle {
      constructor(x, y, dx, dy, size) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.size = size;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 30) + 1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        // Matching DearNote's primary violet color (#a78bfa) with soft opacity in dark mode
        // and warm copper (#8e4f1d) in eye-care light mode
        ctx.fillStyle = theme === "dearnote"
          ? 'rgba(167, 139, 250, 0.45)'
          : 'rgba(142, 79, 29, 0.22)';
        ctx.fill();
      }

      update() {
        this.x += this.dx;
        this.y += this.dy;

        if (this.x > canvas.width || this.x < 0) this.dx = -this.dx;
        if (this.y > canvas.height || this.y < 0) this.dy = -this.dy;

        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (mouse.x !== null && distance < mouse.radius) {
          let forceDirectionX = dx / distance;
          let forceDirectionY = dy / distance;
          let force = (mouse.radius - distance) / mouse.radius;
          let directionX = forceDirectionX * force * this.density * 0.05;
          let directionY = forceDirectionY * force * this.density * 0.05;
          
          this.x += directionX;
          this.y += directionY;
        }

        this.draw();
      }
    }

    const initParticles = () => {
      particles = [];
      const numberOfParticles = (canvas.width * canvas.height) / 9500;
      for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 1.5) + 0.5;
        let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
        let dx = (Math.random() - 0.5) * 0.4;
        let dy = (Math.random() - 0.5) * 0.4;
        particles.push(new Particle(x, y, dx, dy, size));
      }
    };

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
      }
      
      connectParticles();
    };

    const connectParticles = () => {
      let opacityValue = 1;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x))
            + ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
          if (distance < (canvas.width / 7.5) * (canvas.height / 7.5)) {
            opacityValue = 1 - (distance / 18000);
            // Matching DearNote's secondary purple color (#c084fc) in dark mode
            // and antique brass (#a77a3f) in eye-care light mode
            ctx.strokeStyle = theme === "dearnote"
              ? `rgba(192, 132, 252, ${opacityValue * 0.12})`
              : `rgba(167, 122, 63, ${opacityValue * 0.06})`;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };

    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseout', handlePointerOut);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerOut);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: -1, background: 'transparent' }}
    />
  );
};

export default ConstellationBackground;
