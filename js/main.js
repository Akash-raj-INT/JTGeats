// JTGeats Main JavaScript File
(() => {
  'use strict';

  // Global cart object
  const cart = {
    items: [],
    
    add(dishName, price, quantity = 1) {
      const existingItem = this.items.find(item => item.name === dishName);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        this.items.push({ 
          name: dishName, 
          price: parseInt(price), 
          quantity: quantity 
        });
      }
      this.updateDisplay();
      this.showNotification(`${dishName} added to cart!`, 'success');
    },
    
    remove(dishName) {
      this.items = this.items.filter(item => item.name !== dishName);
      this.updateDisplay();
    },
    
    updateQuantity(dishName, newQuantity) {
      const item = this.items.find(item => item.name === dishName);
      if (item) {
        if (newQuantity <= 0) {
          this.remove(dishName);
        } else {
          item.quantity = newQuantity;
          this.updateDisplay();
        }
      }
    },
    
    getTotal() {
      return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
    
    getTotalItems() {
      return this.items.reduce((sum, item) => sum + item.quantity, 0);
    },
    
    updateDisplay() {
      const cartCount = document.querySelector('.cart-count');
      const cartItems = document.getElementById('cartItems');
      const cartTotal = document.getElementById('cartTotal');
      
      if (cartCount) {
        cartCount.textContent = this.getTotalItems();
      }
      
      if (cartItems) {
        cartItems.innerHTML = '';
        this.items.forEach(item => {
          const itemDiv = document.createElement('div');
          itemDiv.className = 'cart-item';
          itemDiv.innerHTML = `
            <span>${item.name}</span>
            <span>${item.quantity} × ₹${item.price}</span>
          `;
          cartItems.appendChild(itemDiv);
        });
      }
      
      if (cartTotal) {
        cartTotal.textContent = `Total: ₹${this.getTotal()}`;
      }
    },
    
    showNotification(message, type = 'success') {
      const notification = document.createElement('div');
      notification.className = `notification ${type}`;
      notification.textContent = message;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.classList.add('show');
      }, 100);
      
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      }, 3000);
    }
  };

  // Modal Management
  class ModalManager {
    constructor() {
      this.modal = document.getElementById('modal');
      this.dishInput = document.getElementById('dishInput');
      this.modalTitle = document.getElementById('modalTitle');
      this.requestForm = document.getElementById('requestForm');
      
      this.init();
    }
    
    init() {
      if (!this.modal) return;
      
      // Bind event listeners
      this.bindEvents();
    }
    
    bindEvents() {
      // Close modal events
      const closeBtn = this.modal.querySelector('.modal-close');
      const overlay = this.modal.querySelector('.modal-overlay');
      const cancelBtn = this.modal.querySelector('.cancel-btn');
      
      if (closeBtn) closeBtn.addEventListener('click', () => this.close());
      if (overlay) overlay.addEventListener('click', () => this.close());
      if (cancelBtn) cancelBtn.addEventListener('click', () => this.close());
      
      // ESC key to close modal
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.modal.classList.contains('open')) {
          this.close();
        }
      });
      
      // Form submission
      if (this.requestForm) {
        this.requestForm.addEventListener('submit', (e) => this.handleSubmit(e));
      }
    }
    
    open(dishName = '') {
      if (!this.modal) return;
      
      this.modal.classList.add('open');
      this.modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
      
      if (dishName) {
        if (this.dishInput) this.dishInput.value = dishName;
        if (this.modalTitle) this.modalTitle.textContent = `Request: ${dishName}`;
      } else {
        if (this.dishInput) this.dishInput.value = '';
        if (this.modalTitle) this.modalTitle.textContent = 'Request a Dish';
      }
      
      // Focus first input
      const firstInput = this.modal.querySelector('input:not([readonly])');
      if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
      }
    }
    
    close() {
      if (!this.modal) return;
      
      this.modal.classList.remove('open');
      this.modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      
      // Reset form
      if (this.requestForm) {
        this.requestForm.reset();
      }
    }
    
    handleSubmit(e) {
      e.preventDefault();
      
      const formData = new FormData(this.requestForm);
      const dish = formData.get('dish') || 'General Request';
      const name = formData.get('name');
      const email = formData.get('email');
      
      if (!name || !email) {
        cart.showNotification('Please fill in all required fields!', 'error');
        return;
      }
      
      // Simulate form submission
      const submitBtn = this.requestForm.querySelector('.submit-request-btn');
      if (submitBtn) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        setTimeout(() => {
          cart.showNotification(`Thank you ${name}! Your request for "${dish}" has been submitted.`, 'success');
          this.close();
          
          submitBtn.classList.remove('loading');
          submitBtn.disabled = false;
        }, 1500);
      }
    }
  }

  // Slider Management
  class SliderManager {
    constructor() {
      this.slider = document.getElementById('popularSlider');
      this.prevBtn = document.getElementById('prevBtn');
      this.nextBtn = document.getElementById('nextBtn');
      this.init();
    }
    
    init() {
      if (!this.slider) return;
      
      this.bindEvents();
      this.setupTouchEvents();
    }
    
    bindEvents() {
      if (this.prevBtn) {
        this.prevBtn.addEventListener('click', () => this.scroll('prev'));
      }
      
      if (this.nextBtn) {
        this.nextBtn.addEventListener('click', () => this.scroll('next'));
      }
    }
    
    computeScrollAmount() {
      const firstCard = this.slider.querySelector('.popular-card');
      if (!firstCard) return 320;
      const gap = 20;
      return Math.round(firstCard.offsetWidth + gap);
    }
    
    scroll(direction) {
      const amt = this.computeScrollAmount();
      const maxScroll = this.slider.scrollWidth - this.slider.clientWidth;

      if (direction === 'next') {
        const newPos = Math.min(this.slider.scrollLeft + amt, maxScroll);
        this.slider.scrollTo({ left: newPos, behavior: 'smooth' });
      } else {
        const newPos = Math.max(this.slider.scrollLeft - amt, 0);
        this.slider.scrollTo({ left: newPos, behavior: 'smooth' });
      }
    }
    
    setupTouchEvents() {
      let startX = 0;
      let scrollStart = 0;
      let isDragging = false;

      this.slider.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        scrollStart = this.slider.scrollLeft;
        isDragging = true;
      });

      this.slider.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const currentX = e.touches[0].clientX;
        const diff = startX - currentX;
        this.slider.scrollLeft = scrollStart + diff;
      });

      this.slider.addEventListener('touchend', () => {
        isDragging = false;
      });
    }
  }

  // Video Player Management
  class VideoManager {
    constructor() {
      this.video = document.getElementById('myVideo');
      this.playPauseBtn = document.getElementById('customPlayPauseBtn');
      this.init();
    }
    
    init() {
      if (!this.video || !this.playPauseBtn) return;
      
      this.bindEvents();
      this.setInitialState();
    }
    
    bindEvents() {
      this.playPauseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.togglePlayPause();
      });
      
      this.video.addEventListener('click', (e) => {
        e.preventDefault();
        this.togglePlayPause();
      });
      
      this.video.addEventListener('loadeddata', () => {
        console.log('Video loaded successfully');
        this.playPauseBtn.style.display = 'flex';
      });
      
      this.video.addEventListener('error', (e) => {
        console.error('Video loading error:', e);
        this.playPauseBtn.textContent = '❌';
        this.playPauseBtn.style.cursor = 'not-allowed';
      });
      
      this.video.addEventListener('ended', () => this.onVideoEnd());
      this.video.addEventListener('pause', () => this.onVideoPause());
      this.video.addEventListener('play', () => this.onVideoPlay());
    }
    
    setInitialState() {
      // Always start with play button visible
      this.playPauseBtn.textContent = '▶';
      this.playPauseBtn.classList.remove('hidden');
      
      // Ensure video is paused initially
      if (!this.video.paused) {
        this.video.pause();
      }
    }
    
    async togglePlayPause() {
      try {
        if (this.video.paused) {
          await this.video.play();
          console.log('Video started playing');
        } else {
          this.video.pause();
          console.log('Video paused');
        }
      } catch (error) {
        console.error('Error playing video:', error);
        cart.showNotification('Unable to play video. Please check if the video file exists.', 'error');
      }
    }
    
    onVideoEnd() {
      this.playPauseBtn.textContent = '▶';
      this.playPauseBtn.classList.remove('hidden');
    }
    
    onVideoPause() {
      this.playPauseBtn.textContent = '▶';
      this.playPauseBtn.classList.remove('hidden');
    }
    
    onVideoPlay() {
      this.playPauseBtn.textContent = '⏸';
      // Keep button visible for 2 seconds, then hide
      setTimeout(() => {
        if (!this.video.paused) {
          this.playPauseBtn.classList.add('hidden');
        }
      }, 2000);
    }
  }

  // Search Management
  class SearchManager {
    constructor() {
      this.searchInput = document.getElementById('heroSearchInput');
      this.searchBtn = document.getElementById('heroSearchBtn');
      this.init();
    }
    
    init() {
      if (!this.searchInput || !this.searchBtn) return;
      
      this.searchBtn.addEventListener('click', () => this.performSearch());
      this.searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.performSearch();
        }
      });
    }
    
    performSearch() {
      const query = this.searchInput.value.trim();
      if (query) {
        cart.showNotification(`Searching for: "${query}"`, 'success');
        console.log('Search query:', query);
        // Here you would implement actual search functionality
        // For example: window.location.href = `/search?q=${encodeURIComponent(query)}`;
      } else {
        cart.showNotification('Please enter a search term!', 'error');
      }
    }
  }

  // Quantity Control Management
  class QuantityManager {
    constructor() {
      this.init();
    }
    
    init() {
      document.addEventListener('click', (e) => this.handleQuantityClick(e));
    }
    
    handleQuantityClick(e) {
      if (!e.target.classList.contains('qty-btn')) return;
      
      e.preventDefault();
      
      const button = e.target;
      const quantityControl = button.closest('.quantity-control');
      
      if (!quantityControl) return;
      
      const qtyNumber = quantityControl.querySelector('.qty-number');
      if (!qtyNumber) return;
      
      let currentQty = parseInt(qtyNumber.textContent, 10);
      if (isNaN(currentQty)) currentQty = 1;
      
      if (button.classList.contains('minus')) {
        currentQty = Math.max(1, currentQty - 1);
      } else if (button.classList.contains('plus')) {
        currentQty = Math.min(99, currentQty + 1);
      }
      
      qtyNumber.textContent = currentQty;
      
      // Add visual feedback
      qtyNumber.style.transform = 'scale(1.2)';
      setTimeout(() => {
        qtyNumber.style.transform = 'scale(1)';
      }, 150);
    }
  }

  // Contact Form Management
  class ContactManager {
    constructor() {
      this.contactForm = document.getElementById('contactForm');
      this.init();
    }
    
    init() {
      if (!this.contactForm) return;
      
      this.contactForm.addEventListener('submit', (e) => this.handleSubmit(e));
    }
    
    handleSubmit(e) {
      e.preventDefault();
      
      const formData = new FormData(this.contactForm);
      const name = formData.get('name');
      const email = formData.get('email');
      const message = formData.get('message');
      
      if (!name || !email || !message) {
        cart.showNotification('Please fill in all fields!', 'error');
        return;
      }
      
      const submitBtn = this.contactForm.querySelector('.submit-btn');
      if (submitBtn) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        setTimeout(() => {
          cart.showNotification(`Thank you ${name}! Your message has been submitted. We will contact you within 48 hours.`, 'success');
          this.contactForm.reset();
          
          submitBtn.classList.remove('loading');
          submitBtn.disabled = false;
        }, 1500);
      }
    }
  }

  // Scroll to Top Management
  class ScrollManager {
    constructor() {
      this.createScrollToTopButton();
      this.setupSmoothScrolling();
    }
    
    createScrollToTopButton() {
      const scrollBtn = document.createElement('button');
      scrollBtn.innerHTML = '↑';
      scrollBtn.className = 'scroll-to-top';
      scrollBtn.setAttribute('aria-label', 'Scroll to top');
      
      document.body.appendChild(scrollBtn);

      // Show/hide based on scroll position
      window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
          scrollBtn.classList.add('show');
        } else {
          scrollBtn.classList.remove('show');
        }
      });

      // Scroll to top on click
      scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
    
    setupSmoothScrolling() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          e.preventDefault();
          const targetId = this.getAttribute('href').substring(1);
          const target = document.getElementById(targetId);
          
          if (target) {
            const headerHeight = document.querySelector('.site-header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight - 20;
            
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
        });
      });
    }
  }

  // Animation Management
  class AnimationManager {
    constructor() {
      this.setupIntersectionObserver();
    }
    
    setupIntersectionObserver() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      // Observe cards for fade-in animation
      document.querySelectorAll('.card').forEach(card => {
        card.classList.add('fade-in');
        observer.observe(card);
      });
      
      // Observe popular cards
      document.querySelectorAll('.popular-card').forEach(card => {
        card.classList.add('fade-in');
        observer.observe(card);
      });
    }
  }

  // Cart Display Management
  class CartDisplayManager {
    constructor() {
      this.cartDisplay = document.getElementById('cartDisplay');
      this.init();
    }
    
    init() {
      if (!this.cartDisplay) return;
      
      // Toggle cart display when cart icon is clicked
      const cartIcon = document.querySelector('.cart-icon');
      if (cartIcon) {
        cartIcon.addEventListener('click', () => this.toggle());
      }
      
      // Close cart when clicking outside
      document.addEventListener('click', (e) => {
        if (!this.cartDisplay.contains(e.target) && 
            !e.target.closest('.cart-icon') && 
            this.cartDisplay.classList.contains('show')) {
          this.close();
        }
      });
    }
    
    toggle() {
      this.cartDisplay.classList.toggle('show');
    }
    
    close() {
      this.cartDisplay.classList.remove('show');
    }
  }

  // Main App Initialization
  document.addEventListener('DOMContentLoaded', () => {
    console.log('JTGeats website initializing...');

    // Initialize all managers
    const modalManager = new ModalManager();
    const sliderManager = new SliderManager();
    const videoManager = new VideoManager();
    const searchManager = new SearchManager();
    const quantityManager = new QuantityManager();
    const contactManager = new ContactManager();
    const scrollManager = new ScrollManager();
    const animationManager = new AnimationManager();
    const cartDisplayManager = new CartDisplayManager();

    // Handle Add to Cart buttons
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('add-btn')) {
        e.preventDefault();
        
        const dishName = e.target.getAttribute('data-name');
        const price = e.target.getAttribute('data-price');
        
        if (dishName && price) {
          cart.add(dishName, price);
          
          // Visual feedback
          e.target.style.transform = 'scale(0.9)';
          setTimeout(() => {
            e.target.style.transform = 'scale(1)';
          }, 150);
        }
      }
    });

    // Handle Request Dish button
    const requestDishBtn = document.getElementById('requestDishBtn');
    if (requestDishBtn) {
      requestDishBtn.addEventListener('click', () => {
        modalManager.open();
      });
    }

    // Handle cart icon click for mobile
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
      cartIcon.addEventListener('click', () => {
        if (cart.getTotalItems() === 0) {
          cart.showNotification('Your cart is empty!', 'error');
        }
      });
    }

    // Preload critical images
    const criticalImages = [
      'https://i.postimg.cc/xCPFSxzJ/Screenshot-2025-08-28-222531.png',
      'https://i.postimg.cc/dtWVH8mQ/Screenshot-2025-08-30-125628.png'
    ];
    
    criticalImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });

    // Initialize cart display
    cart.updateDisplay();

    // Handle page visibility changes (pause video when tab is not active)
    document.addEventListener('visibilitychange', () => {
      const video = document.getElementById('myVideo');
      if (video && document.hidden && !video.paused) {
        video.pause();
      }
    });

    // Add loading states to all forms
    document.querySelectorAll('form').forEach(form => {
      form.addEventListener('submit', (e) => {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn && !submitBtn.classList.contains('loading')) {
          submitBtn.classList.add('loading');
          submitBtn.disabled = true;
          
          // Remove loading state after form processing
          setTimeout(() => {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
          }, 2000);
        }
      });
    });

    // Error handling for images
    document.querySelectorAll('img').forEach(img => {
      img.addEventListener('error', function() {
        this.style.display = 'none';
        console.warn('Failed to load image:', this.src);
      });
    });

    // Performance optimization: Lazy load images
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              observer.unobserve(img);
            }
          }
        });
      });

      // For future lazy loading implementation
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }

    // Make cart globally available for debugging
    window.cart = cart;
    window.modalManager = modalManager;

    console.log('JTGeats website loaded successfully!');
    cart.showNotification('Welcome to JTGeats! Authentic home food delivery.', 'success');

  }); // End DOMContentLoaded

})(); // End IIFE