  
    (function() {
      // ---------- STARFIELD CANVAS ANIMATION (stars + connecting lines) ----------
      const canvas = document.getElementById('starCanvas');
      const ctx = canvas.getContext('2d');
      let width, height;
      let stars = [];
      const STAR_COUNT = 140;
      const CONNECT_DISTANCE = 130;
      const LINE_OPACITY_BASE = 0.25;

      function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        initStars();
      }

      function initStars() {
        stars = [];
        for (let i = 0; i < STAR_COUNT; i++) {
          stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2.2 + 0.8,
            speedX: (Math.random() - 0.5) * 0.25,
            speedY: (Math.random() - 0.5) * 0.25,
            opacity: Math.random() * 0.7 + 0.3,
          });
        }
      }

      function drawStarsAndLines() {
        ctx.clearRect(0, 0, width, height);
        
        // Update positions & draw stars
        for (let i = 0; i < stars.length; i++) {
          const s = stars[i];
          s.x += s.speedX;
          s.y += s.speedY;
          
          // Wrap around edges
          if (s.x < 0) s.x = width;
          if (s.x > width) s.x = 0;
          if (s.y < 0) s.y = height;
          if (s.y > height) s.y = 0;
          
          // Draw star glow
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`;
          ctx.fill();
          
          // subtle glow
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(180, 210, 255, ${s.opacity * 0.2})`;
          ctx.fill();
        }
        
        // Draw connecting lines between close stars
        for (let i = 0; i < stars.length; i++) {
          for (let j = i + 1; j < stars.length; j++) {
            const s1 = stars[i];
            const s2 = stars[j];
            const dx = s1.x - s2.x;
            const dy = s1.y - s2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < CONNECT_DISTANCE) {
              const opacity = (1 - dist / CONNECT_DISTANCE) * LINE_OPACITY_BASE * 0.9;
              ctx.beginPath();
              ctx.moveTo(s1.x, s1.y);
              ctx.lineTo(s2.x, s2.y);
              ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
              ctx.lineWidth = 0.6;
              ctx.stroke();
            }
          }
        }
        
        requestAnimationFrame(drawStarsAndLines);
      }

      window.addEventListener('resize', resizeCanvas);
      resizeCanvas();
      drawStarsAndLines();

      // ---------- 3D CARDS WITH IMAGES ----------
      const container = document.getElementById('card3DContainer');
      
      // Using high-quality placeholder images that represent categories (Unsplash creative commons style)
      const cardsData = [
        { 
          title: "Mini Boden", 
          desc: "Bright playful prints", 
          style: "Classic British ",
          img: "assets/cloth-1.png"
        },
        { 
          title: "Hanna Andersson", 
          desc: "Soft comfort staples", 
          style: "organic cotton",
          img: "assets/cloth-2.png"
        },
        { 
          title: "C'era Una Volta", 
          desc: "Poetic timeless heirlooms", 
          style: "sky wing style",
          img: "assets/cloth-3.png"
        },
        { 
          title: "Billieblush", 
          desc: "Bold sparkle & ruffles ", 
          style: "energetic style",
          img: "assets/cloth-4.png"
        },
        { 
          title: "Arabella & Rose", 
          desc: "Dreamy special occasion", 
          style: "Pakistani brand",
          img: "assets/cloth-5.png"
        }
      ];

      const cardCount = cardsData.length;
      let radius = 430;
      let currentAngle = 0;
      const rotationSpeed = 0.007;
      let animationId = null;
      let cardWrappers = [];

      function buildCards() {
        container.innerHTML = '';
        cardWrappers = [];
        
        cardsData.forEach((data, index) => {
          const wrapper = document.createElement('div');
          wrapper.className = 'card-wrapper';
          wrapper.dataset.index = index;
          
          wrapper.innerHTML = `
            <div class="card-3d ${data.style}">
              <img src="${data.img}" alt="${data.title}" class="card-image" loading="lazy">
              <div class="card-content">
                <h3>${data.title}</h3>
                <p>${data.desc}</p>
              </div>
            </div>
          `;
          
          const card = wrapper.querySelector('.card-3d');
          wrapper.addEventListener('mousemove', (e) => {
            if (!card) return;
            const rect = wrapper.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const rotateX = (y / rect.height) * -10;
            const rotateY = (x / rect.width) * 10;
            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
          });
          
          wrapper.addEventListener('mouseleave', () => {
            if (card) card.style.transform = '';
          });
          
          container.appendChild(wrapper);
          cardWrappers.push(wrapper);
        });
      }

      function updatePositions() {
        if (!cardWrappers.length) return;
        const r = radius;
        const angleStep = (Math.PI * 2) / cardCount;
        
        cardWrappers.forEach((wrapper, index) => {
          const angle = currentAngle + index * angleStep;
          const x = Math.sin(angle) * r;
          const z = Math.cos(angle) * r;
          const yOffset = Math.sin(angle * 2) * 16;
          const rotateY = angle + Math.PI / 2;
          const rotateYDeg = (rotateY * 180) / Math.PI;
          
          const normalizedZ = (z + r) / (2 * r);
          const opacity = 0.6 + normalizedZ * 0.4;
          const scale = 0.84 + normalizedZ * 0.2;
          
          wrapper.style.transform = `translate3d(${x}px, ${yOffset}px, ${z}px) rotateY(${rotateYDeg}deg) scale(${scale})`;
          wrapper.style.opacity = opacity;
          wrapper.style.zIndex = Math.round(normalizedZ * 100);
        });
      }

      function animateLoop() {
        currentAngle += rotationSpeed;
        if (currentAngle > Math.PI * 2) currentAngle -= Math.PI * 2;
        updatePositions();
        animationId = requestAnimationFrame(animateLoop);
      }

      // Drag interaction
      let isDragging = false;
      let prevX = 0;

      function setupDrag() {
        container.addEventListener('mousedown', (e) => {
          isDragging = true;
          prevX = e.clientX;
          if (animationId) { cancelAnimationFrame(animationId); animationId = null; }
          container.style.cursor = 'grabbing';
          e.preventDefault();
        });
        
        window.addEventListener('mousemove', (e) => {
          if (!isDragging) return;
          const delta = e.clientX - prevX;
          currentAngle += delta * 0.012;
          prevX = e.clientX;
          updatePositions();
        });
        
        window.addEventListener('mouseup', () => {
          if (isDragging) {
            isDragging = false;
            container.style.cursor = 'default';
            if (!animationId) animateLoop();
          }
        });
        
        container.addEventListener('touchstart', (e) => {
          if (e.touches.length === 1) {
            isDragging = true;
            prevX = e.touches[0].clientX;
            if (animationId) { cancelAnimationFrame(animationId); animationId = null; }
            e.preventDefault();
          }
        }, { passive: false });
        
        window.addEventListener('touchmove', (e) => {
          if (!isDragging || e.touches.length !== 1) return;
          const delta = e.touches[0].clientX - prevX;
          currentAngle += delta * 0.012;
          prevX = e.touches[0].clientX;
          updatePositions();
          e.preventDefault();
        }, { passive: false });
        
        window.addEventListener('touchend', () => {
          if (isDragging) {
            isDragging = false;
            if (!animationId) animateLoop();
          }
        });
      }

      function handleResize() {
        const w = window.innerWidth;
        radius = w < 550 ? 270 : (w < 750 ? 340 : 430);
        updatePositions();
      }

      window.addEventListener('resize', handleResize);

      function init() {
        buildCards();
        handleResize();
        currentAngle = -Math.PI / 2.1;
        updatePositions();
        animateLoop();
        setupDrag();
      }

      init();
    })();
  