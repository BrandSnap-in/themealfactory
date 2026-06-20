/**
 * The Meal Factory - Custom Interactive Engine
 * Pure Vanilla JS, highly optimized for performance & UX
 */

document.addEventListener('DOMContentLoaded', () => {

  // Global Site Configuration
  const PHONE_NUMBER = "919000000000"; // Replace with actual business WhatsApp number (with country code, e.g., 91 for India)

  // 1. Sticky Header scroll effects
  const header = document.querySelector('.top-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Highlight Active Section in Navbar
    highlightActiveSection();
  });

  // 2. Mobile Nav Hamburguer and Panel Toggles
  const menuToggle = document.getElementById('menuToggle');
  const mobileNavPanel = document.getElementById('mobileNavPanel');
  const mobileNavLinks = mobileNavPanel.querySelectorAll('a');

  function toggleMobileMenu() {
    menuToggle.classList.toggle('active');
    mobileNavPanel.classList.toggle('open');
    document.body.style.overflow = mobileNavPanel.classList.contains('open') ? 'hidden' : '';
  }

  menuToggle.addEventListener('click', toggleMobileMenu);

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      // Close menu when a link is clicked
      if (mobileNavPanel.classList.contains('open')) {
        toggleMobileMenu();
      }
    });
  });

  // 3. Category Filter Mechanism for Dishes
  const filterButtons = document.querySelectorAll('.category-tag-btn');
  const dishCards = document.querySelectorAll('.dish-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active from any other category button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      // Add active to clicked button
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      dishCards.forEach(card => {
        const dishTags = card.getAttribute('data-categories').split(' ');
        
        if (filterValue === 'all' || dishTags.includes(filterValue)) {
          // Show with elegant animation transition
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 50);
        } else {
          // Hide card with fade out
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px) scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // 4. Trust bar - Animated Counters
  const counterCards = document.querySelectorAll('.trust-card');
  
  const countUp = (element) => {
    const target = parseInt(element.getAttribute('data-target'), 10);
    const suffix = element.getAttribute('data-suffix') || '';
    let count = 0;
    const speed = 2000; // Animation speed in ms
    const increment = target / (speed / 16); // ~60fps refresh rate

    const updateCount = () => {
      count += increment;
      if (count < target) {
        element.innerHTML = Math.floor(count).toLocaleString() + suffix;
        requestAnimationFrame(updateCount);
      } else {
        element.innerHTML = target.toLocaleString() + suffix;
      }
    };
    updateCount();
  };

  // IntersectionObserver to spark counters when visible
  const observerOptions = {
    threshold: 0.25,
    rootMargin: "0px"
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const numberSpan = entry.target.querySelector('.counter-number');
        if (numberSpan && !numberSpan.classList.contains('counted')) {
          countUp(numberSpan);
          numberSpan.classList.add('counted');
        }
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  counterCards.forEach(card => {
    counterObserver.observe(card);
  });

  // 5. Signature Dish "Order Now" Helper - Quick Select Conversion
  const selectInquiryElement = document.getElementById('orderInquiry');
  const floatingCartBadge = document.getElementById('floatingCartBadge');
  const cartItemNameSpan = document.getElementById('cartItemName');
  
  dishCards.forEach(card => {
    const addToCartBtn = card.querySelector('.dish-add-btn');
    const dishTitle = card.querySelector('.dish-title').textContent;

    addToCartBtn.addEventListener('click', () => {
      // 1. Auto-select item in the drop-down menu
      if (selectInquiryElement) {
        selectInquiryElement.value = dishTitle;
      }

      // 2. Display persistent bottom floating cart badge
      if (floatingCartBadge && cartItemNameSpan) {
        cartItemNameSpan.textContent = dishTitle;
        floatingCartBadge.style.display = 'flex';
        
        // Pulse effects trigger
        floatingCartBadge.style.transform = 'scale(1.15)';
        setTimeout(() => {
          floatingCartBadge.style.transform = 'scale(1)';
        }, 150);
      }

      // 3. Smooth scroll down to checkout/WhatsApp inquiry directly
      const contactSection = document.getElementById('orderDirectSection');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }

      // Show temporary custom message badge top center of card
      showToastAlert(`Selected ${dishTitle}! Complete information to order.`);
    });
  });

  // Auto focus field helper on clicking cart badge
  if (floatingCartBadge) {
    floatingCartBadge.addEventListener('click', () => {
      const contactSection = document.getElementById('orderDirectSection');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Helper custom notifications toast alerts
  function showToastAlert(text) {
    const existing = document.querySelector('.toast-banner');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-banner';
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%) translateY(-20px);
      background-color: var(--primary);
      color: #FFFFFF;
      padding: 12px 24px;
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-lg);
      font-weight: 600;
      font-size: 0.9rem;
      font-family: var(--font-display);
      border-left: 4px solid var(--accent);
      z-index: 1000;
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    `;
    toast.textContent = text;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    }, 50);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(-20px)';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // 6. Testimonial/Reviews Slider Carousel
  const track = document.getElementById('slidesTrack');
  const slides = Array.from(track.children);
  const dotsNav = document.getElementById('carouselDots');
  const dots = Array.from(dotsNav.children);
  const leftBtn = document.getElementById('slideLeftBtn');
  const rightBtn = document.getElementById('slideRightBtn');
  
  let currentSlideIndex = 0;

  const moveSlide = (targetIndex) => {
    track.style.transform = `translateX(-${targetIndex * 100}%)`;
    dots[currentSlideIndex].classList.remove('active');
    dots[targetIndex].classList.add('active');
    currentSlideIndex = targetIndex;
  };

  rightBtn.addEventListener('click', () => {
    let nextIndex = currentSlideIndex + 1;
    if (nextIndex >= slides.length) {
      nextIndex = 0; // wrap around
    }
    moveSlide(nextIndex);
  });

  leftBtn.addEventListener('click', () => {
    let prevIndex = currentSlideIndex - 1;
    if (prevIndex < 0) {
      prevIndex = slides.length - 1; // wrap around
    }
    moveSlide(prevIndex);
  });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      moveSlide(index);
    });
  });

  // Touch Swipe gesture support on reviews slide
  let startX = 0;
  let endX = 0;

  track.addEventListener('touchstart', (e) => {
    startX = e.changedTouches[0].screenX;
  });

  track.addEventListener('touchend', (e) => {
    endX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  const handleSwipe = () => {
    const swipeThreshold = 50; 
    if (startX - endX > swipeThreshold) {
      // swipe left -> next
      rightBtn.click();
    } else if (endX - startX > swipeThreshold) {
      // swipe right -> prev
      leftBtn.click();
    }
  };

  // 7. Interactive FAQ Accordion Trigger
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');

    trigger.addEventListener('click', () => {
      const isOpen = item.hasAttribute('open');

      // Close all other elements (elegant accordion behavior)
      faqItems.forEach(innerItem => {
        innerItem.removeAttribute('open');
        const innerContent = innerItem.querySelector('.faq-content');
        if (innerContent) {
          innerContent.style.maxHeight = '0px';
        }
      });

      if (!isOpen) {
        item.setAttribute('open', '');
        content.style.maxHeight = `${content.scrollHeight}px`;
      } else {
        item.removeAttribute('open');
        content.style.maxHeight = '0px';
      }
    });
  });

  // 8. Contact Form - WhatsApp Custom String Compiler
  const contactForm = document.getElementById('contactEnquiryForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('custName').value.trim();
      const phone = document.getElementById('custPhone').value.trim();
      const inquiry = document.getElementById('orderInquiry').value;
      const message = document.getElementById('custMessage').value.trim();

      if (!name || !phone) {
        showToastAlert("Please enter your name and contact phone number!");
        return;
      }

      // Compile neat text structure matching user guidelines
      const formattedText = `Hello The Meal Factory,

Name: ${name}
Phone: ${phone}
Order Inquiry: ${inquiry}
Message: ${message || "N/A"}

I would like to place an order / know more about your menu.`;

      // URI Safe Encoding
      const encodedMessage = encodeURIComponent(formattedText);
      const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodedMessage}`;

      // Open tab
      window.open(whatsappUrl, '_blank');
      
      // Reset form gracefully
      contactForm.reset();
      if (floatingCartBadge) {
        floatingCartBadge.style.display = 'none';
      }
      
      showToastAlert("Routing your request to The Meal Factory on WhatsApp...");
    });
  }

  // Scroll active section link highlighter
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.desktop-nav a, .bottom-nav-item');

  function highlightActiveSection() {
    let scrollY = window.pageYOffset;
    
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

});
