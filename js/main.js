// js/main.js
(() => {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {

    /* --------- Modal logic --------- */
    const modal = document.getElementById('modal');
    const dishInput = document.getElementById('dishInput');
    const modalTitle = document.getElementById('modalTitle');

    if (modal) {
      // Handle "Request Dish" buttons from menu cards
      document.querySelectorAll('.request-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          modal.classList.add('open');
          modal.setAttribute('aria-hidden', 'false');
          if (dishInput) dishInput.value = btn.dataset.name || '';
          if (modalTitle) modalTitle.textContent = 'Request: ' + (btn.dataset.name || '');
        });
      });

      // Handle "Add" buttons from menu cards
      document.querySelectorAll('.add-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const dishName = btn.dataset.name || 'Item';
          // You can implement add to cart functionality here
          alert(`${dishName} added to cart!`);
          console.log('Added to cart:', dishName);
        });
      });

      // Handle main "Request a Dish" button
      document.querySelectorAll('.request-dish-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          modal.classList.add('open');
          modal.setAttribute('aria-hidden', 'false');
          if (dishInput) dishInput.value = '';
          if (modalTitle) modalTitle.textContent = 'Request a Dish';
        });
      });

      const closeModal = () => {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
      };

      document.querySelectorAll('[data-close], .modal-close').forEach(el =>
        el.addEventListener('click', closeModal)
      );

      document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
    }

    /* --------- Video Play Button --------- */
    const playButton = document.querySelector('.play-button');
    if (playButton) {
      playButton.addEventListener('click', () => {
        // You can add video play functionality here
        alert('Video functionality can be added here!');
      });
    }

    /* --------- Contact Form --------- */
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        const name = formData.get('name') || 'Name';
        // Handle form submission here
        alert(`Thank you ${name}! Your message has been submitted. We will contact you within 48 hours.`);
        contactForm.reset();
      });
    }

    /* --------- Modal Form --------- */
    const requestForm = document.getElementById('requestForm');
    if (requestForm) {
      requestForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(requestForm);
        const dish = formData.get('dish') || 'General Request';
        const name = formData.get('name');
        const email = formData.get('email');
        
        alert(`Thank you ${name}! Your request for "${dish}" has been submitted. We'll contact you at ${email} soon.`);
        requestForm.reset();
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
      });
    }

    /* --------- Hero Search Box --------- */
    const searchForm = document.querySelector('.search-box');
    const searchInput = document.querySelector('.search-box input');
    const searchButton = document.querySelector('.search-box button');

    if (searchButton && searchInput) {
      const performSearch = () => {
        const query = searchInput.value.trim();
        if (query) {
          // You can implement search functionality here
          alert(`Searching for: "${query}"`);
          console.log('Search query:', query);
          // Example: window.location.href = `/search?q=${encodeURIComponent(query)}`;
        }
      };

      searchButton.addEventListener('click', performSearch);
      
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          performSearch();
        }
      });
    }

    /* --------- Quantity buttons --------- */
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('qty-btn')) {
        e.preventDefault();
        
        const button = e.target;
        const quantityControl = button.closest('.quantity-control');
        
        if (!quantityControl) return;
        
        const qtyNumber = quantityControl.querySelector('.qty-number');
        if (!qtyNumber) return;
        
        let currentQty = parseInt(qtyNumber.textContent, 10);
        if (isNaN(currentQty)) currentQty = 1;
        
        const buttonText = button.textContent.trim();
        
        if (buttonText === '−' || button.classList.contains('minus')) {
          currentQty = Math.max(1, currentQty - 1);
        } else if (buttonText === '+' || button.classList.contains('plus')) {
          currentQty = Math.min(99, currentQty + 1);
        }
        
        qtyNumber.textContent = currentQty;
        
        // Optional: Log for debugging
        const card = button.closest('.popular-card');
        if (card) {
          const dishName = card.querySelector('h3')?.textContent || 'Item';
          console.log(`${dishName} quantity: ${currentQty}`);
        }
      }
    });

    /* --------- Slider setup --------- */
    const sliderEl = document.querySelector('.my-slider');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (!sliderEl) return;

    // ensure no half item is visible
    sliderEl.style.overflow = "hidden";
    sliderEl.style.display = "flex";
    sliderEl.style.gap = "20px";

    // Calculate one full card width including gap
    const computeScrollAmount = () => {
      const firstCard = sliderEl.querySelector('.popular-card');
      if (!firstCard) return 320;
      const gap = 20;
      return Math.round(firstCard.offsetWidth + gap);
    };

    // Prevent overscroll
    const safeScroll = (direction) => {
      const amt = computeScrollAmount();
      const maxScroll = sliderEl.scrollWidth - sliderEl.clientWidth;

      if (direction === 'next') {
        const newPos = Math.min(sliderEl.scrollLeft + amt, maxScroll);
        sliderEl.scrollTo({ left: newPos, behavior: 'smooth' });
      } else {
        const newPos = Math.max(sliderEl.scrollLeft - amt, 0);
        sliderEl.scrollTo({ left: newPos, behavior: 'smooth' });
      }
    };

    // Prev/Next Buttons
    if (prevBtn) prevBtn.addEventListener('click', () => safeScroll('prev'));
    if (nextBtn) nextBtn.addEventListener('click', () => safeScroll('next'));

    // Touch/Swipe support for mobile
    let startX = 0;
    let scrollStart = 0;
    let isDragging = false;

    sliderEl.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      scrollStart = sliderEl.scrollLeft;
      isDragging = true;
    });

    sliderEl.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const currentX = e.touches[0].clientX;
      const diff = startX - currentX;
      sliderEl.scrollLeft = scrollStart + diff;
    });

    sliderEl.addEventListener('touchend', () => {
      isDragging = false;
    });

    /* --------- Smooth scrolling for navigation links --------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });

    /* --------- Add loading states to buttons --------- */
    const addLoadingState = (button, duration = 1000) => {
      const originalText = button.textContent;
      button.textContent = 'Loading...';
      button.disabled = true;
      
      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
      }, duration);
    };

    // Apply loading states to form submit buttons
    document.querySelectorAll('button[type="submit"]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.closest('form')) {
          addLoadingState(btn);
        }
      });
    });

    /* --------- Scroll to top functionality --------- */
    const createScrollToTopButton = () => {
      const scrollBtn = document.createElement('button');
      scrollBtn.innerHTML = '↑';
      scrollBtn.className = 'scroll-to-top';
      scrollBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--green-1);
        color: white;
        border: none;
        font-size: 20px;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
      `;

      document.body.appendChild(scrollBtn);

      // Show/hide based on scroll position
      window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
          scrollBtn.style.opacity = '1';
          scrollBtn.style.visibility = 'visible';
        } else {
          scrollBtn.style.opacity = '0';
          scrollBtn.style.visibility = 'hidden';
        }
      });

      // Scroll to top on click
      scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    };

    // Initialize scroll to top button
    createScrollToTopButton();

    /* --------- Intersection Observer for animations --------- */
    const observeElements = () => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      }, { threshold: 0.1 });

      // Observe cards for fade-in animation
      document.querySelectorAll('.card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
      });
    };

    // Initialize animations
    observeElements();

    /* --------- Cart functionality (optional enhancement) --------- */
    const cart = {
      items: [],
      
      add(dishName, price, quantity = 1) {
        const existingItem = this.items.find(item => item.name === dishName);
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          this.items.push({ name: dishName, price: price, quantity: quantity });
        }
        this.updateCartDisplay();
      },
      
      updateCartDisplay() {
        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
        console.log('Cart total items:', totalItems);
        // You can update a cart counter in the UI here
      },
      
      getTotal() {
        return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      }
    };

    // Make cart available globally for debugging
    window.cart = cart;

    console.log('JTGeats website loaded successfully!');

  }); // DOMContentLoaded
})(); // IIFE