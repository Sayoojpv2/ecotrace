import './style.css'

// Navbar scroll effect
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.style.background = 'rgba(13, 17, 16, 0.95)';
    navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
    navbar.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
  } else {
    navbar.style.background = 'rgba(13, 17, 16, 0.7)';
    navbar.style.boxShadow = 'none';
    navbar.style.borderBottom = '1px solid rgba(255, 255, 255, 0.08)';
  }
});

// Mobile menu toggle
const mobileBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

mobileBtn.addEventListener('click', () => {
  const isDisplayed = window.getComputedStyle(navLinks).display !== 'none';
  if (isDisplayed && window.innerWidth <= 768) {
    navLinks.style.display = 'none';
  } else {
    navLinks.style.display = 'flex';
    navLinks.style.flexDirection = 'column';
    navLinks.style.position = 'absolute';
    navLinks.style.top = '70px';
    navLinks.style.left = '0';
    navLinks.style.width = '100%';
    navLinks.style.background = 'rgba(13, 17, 16, 0.95)';
    navLinks.style.padding = '2rem';
    navLinks.style.backdropFilter = 'blur(12px)';
    navLinks.style.borderBottom = '1px solid rgba(255, 255, 255, 0.08)';
  }
});

// Reset mobile menu on resize
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    navLinks.style.display = 'flex';
    navLinks.style.flexDirection = 'row';
    navLinks.style.position = 'static';
    navLinks.style.background = 'transparent';
    navLinks.style.padding = '0';
    navLinks.style.borderBottom = 'none';
  } else {
    navLinks.style.display = 'none';
  }
});

// Bar chart animation effect
document.addEventListener('DOMContentLoaded', () => {
  const bars = document.querySelectorAll('.bar');
  
  const animateBars = () => {
    bars.forEach((bar, index) => {
      setTimeout(() => {
        bar.classList.add('active');
        setTimeout(() => {
           if (index !== 4) bar.classList.remove('active'); // Keep the highest bar active
        }, 800);
      }, index * 200);
    });
  };
  
  // Trigger animation after a slight delay
  setTimeout(animateBars, 500);
  
  // Re-trigger periodically for visual interest
  setInterval(animateBars, 5000);
});
