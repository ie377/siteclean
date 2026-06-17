(function() {
  'use strict';

  /* ========================================
     BURGER MENU
     ======================================== */
  const burger = document.querySelector('.header__burger');
  const nav = document.querySelector('.header__nav');
  const overlay = document.querySelector('.header__overlay');

  function toggleMenu(open) {
    const isOpen = open !== undefined ? open : !nav.classList.contains('header__nav--open');
    nav.classList.toggle('header__nav--open', isOpen);
    burger.classList.toggle('header__burger--active', isOpen);
    overlay.classList.toggle('header__overlay--visible', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  if (burger && nav && overlay) {
    burger.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleMenu();
    });

    overlay.addEventListener('click', function() {
      toggleMenu(false);
    });

    document.querySelectorAll('.header__menu-link').forEach(function(link) {
      link.addEventListener('click', function() {
        toggleMenu(false);
      });
    });
  }

  /* ========================================
     PHONE MASK
     ======================================== */
  var phoneInputs = document.querySelectorAll('.js-phone-mask');

  phoneInputs.forEach(function(input) {
    input.addEventListener('input', function(e) {
      var value = this.value.replace(/\D/g, '');

      if (value.length === 0) {
        this.value = '';
        return;
      }

      if (value.length === 1 && value !== '7') {
        value = '7' + value;
      }

      var formatted = '+7 ';

      if (value.length > 1) {
        formatted += '(' + value.substring(1, 4);
      }
      if (value.length >= 5) {
        formatted += ') ' + value.substring(4, 7);
      }
      if (value.length >= 8) {
        formatted += '-' + value.substring(7, 9);
      }
      if (value.length >= 10) {
        formatted += '-' + value.substring(9, 11);
      }

      this.value = formatted;
    });

    input.addEventListener('keydown', function(e) {
      if (e.key === 'Backspace' && this.value.length <= 4) {
        this.value = '';
      }
    });

    input.addEventListener('focus', function() {
      if (!this.value) {
        this.value = '+7 (';
      }
    });

    input.addEventListener('blur', function() {
      if (this.value === '+7 (') {
        this.value = '';
      }
    });
  });

  /* ========================================
     FORM HANDLING (Fetch API → Formspree)
     ======================================== */
  var forms = document.querySelectorAll('.js-form');

  forms.forEach(function(form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      var submitBtn = form.querySelector('.js-form-submit');
      var successBlock = form.querySelector('.js-form-success');
      var formFields = form.querySelector('.js-form-fields');
      var inputs = form.querySelectorAll('input, textarea');

      // Validate
      var isValid = true;
      inputs.forEach(function(input) {
        var errorEl = input.parentElement.querySelector('.form__error');
        input.classList.remove('form__input--error');

        if (input.hasAttribute('required') && !input.value.trim()) {
          input.classList.add('form__input--error');
          isValid = false;
        }

        if (input.type === 'checkbox' && input.hasAttribute('required') && !input.checked) {
          input.classList.add('form__input--error');
          isValid = false;
        }
      });

      if (!isValid) return;

      // Loading state
      submitBtn.classList.add('btn--loading');
      submitBtn.disabled = true;

      var formData = new FormData(form);

      fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
      .then(function(response) {
        if (response.ok) {
          formFields.style.display = 'none';
          successBlock.classList.add('form__success--visible');
        } else {
          response.json().then(function(data) {
            if (Object.hasOwn(data, 'errors')) {
              alert(data.errors.map(function(error) { return error.message; }).join(', '));
            } else {
              alert('Ошибка при отправке. Пожалуйста, попробуйте позже.');
            }
          });
        }
      })
      .catch(function() {
        alert('Ошибка соединения. Проверьте интернет и попробуйте снова.');
      })
      .finally(function() {
        submitBtn.classList.remove('btn--loading');
        submitBtn.disabled = false;
      });
    });
  });

  /* ========================================
     INTERSECTION OBSERVER (fade-in animations)
     ======================================== */
  if ('IntersectionObserver' in window) {
    var animElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .stagger-children');

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains('stagger-children')) {
            entry.target.classList.add('stagger-children--visible');
          } else {
            entry.target.classList.add(entry.target.classList.contains('fade-in-up')
              ? 'fade-in-up--visible'
              : entry.target.classList.contains('fade-in-left')
                ? 'fade-in-left--visible'
                : 'fade-in-right--visible');
          }
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    animElements.forEach(function(el) {
      observer.observe(el);
    });
  } else {
    document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .stagger-children').forEach(function(el) {
      el.classList.add('fade-in-up--visible');
    });
  }

  /* ========================================
     FAQ ACCORDION
     ======================================== */
  var faqItems = document.querySelectorAll('.faq__item');

  faqItems.forEach(function(item) {
    var question = item.querySelector('.faq__question');
    if (question) {
      question.addEventListener('click', function() {
        var isOpen = item.classList.contains('faq__item--open');

        faqItems.forEach(function(other) {
          other.classList.remove('faq__item--open');
        });

        if (!isOpen) {
          item.classList.add('faq__item--open');
        }
      });
    }
  });

  /* ========================================
     FLOATING PHONE BUTTON
     ======================================== */
  var floatingPhone = document.querySelector('.js-floating-phone');

  if (floatingPhone) {
    floatingPhone.addEventListener('click', function() {
      var form = document.querySelector('.js-form');
      if (form) {
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(function() {
          var firstInput = form.querySelector('input:not([type="checkbox"]), textarea');
          if (firstInput) firstInput.focus();
        }, 600);
      } else {
        window.location.href = 'contacts.html#form';
      }
    });
  }

  /* ========================================
     VIDEO SECTION — Play / Pause
     ======================================== */
  var video = document.getElementById('sitecleanVideo');
  var playBtn = document.getElementById('videoPlayBtn');
  var videoSection = document.getElementById('videoSection');

  if (video && playBtn && videoSection) {
    playBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      video.play();
      playBtn.classList.add('video-section__play--hidden');
    });

    videoSection.addEventListener('click', function() {
      if (video.paused) {
        video.play();
        playBtn.classList.add('video-section__play--hidden');
      } else {
        video.pause();
        playBtn.classList.remove('video-section__play--hidden');
      }
    });
  }

})();
