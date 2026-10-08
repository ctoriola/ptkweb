/***************************************************
==================== JS INDEX ======================
****************************************************
01. sticky js
02. back-to-top
03. Parallaxie
04. mobile menu 
05. Nice Select Js Start
06. Mouse Cursor Animation
07. popup image
08. popup video
09. Aos Animation



****************************************************/

(function ($) {
  'use strict';

  // The page script may run after DOMContentLoaded (it is started after first paint).
  var whenReady = function (fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  };

  // Each page only loads the libraries it uses (see tools/build.mjs).
  // Pages without a slider get a no-op stand-in so the slider setup below is harmless.
  var Swiper = window.Swiper || function () {
    return { on: function () {}, slideToLoop: function () {} };
  };

  /* ================================
        01. stiky js
    ================================ */
  // One passive scroll listener, batched per animation frame: read layout first,
  // then write classes/styles (avoids the forced reflows of separate handlers).
  var header = document.querySelector('.th-header-sticky');
  var progressWrap = document.querySelector('.progress-wrap');
  var progressPath = document.querySelector('.progress-wrap path');
  var pathLength = progressPath ? progressPath.getTotalLength() : 0;
  if (progressPath) {
    progressPath.style.strokeDasharray = pathLength + ' ' + pathLength;
    progressPath.style.strokeDashoffset = pathLength;
  }
  var scrollable = 1;
  var measure = function () {
    scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  };
  var ticking = false;
  var onScroll = function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY;
      if (header) header.classList.toggle('header-sticky', y >= 100);
      if (progressWrap) progressWrap.classList.toggle('active-progress', y > 50);
      if (progressPath) progressPath.style.strokeDashoffset = pathLength - (y * pathLength) / scrollable;
      ticking = false;
    });
  };
  measure();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { measure(); onScroll(); }, { passive: true });
  window.addEventListener('load', measure);
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(document.body);
  onScroll();
  var duration = 550;
  jQuery('.progress-wrap').on('click', function (event) {
    event.preventDefault();
    jQuery('html, body').animate({ scrollTop: 0 }, duration);
    return false;
  });

  /* ================================
       03. Parallaxie
    ================================ */

  // (removed: the parallax background effect; the page texture is now a CSS tile)

  /* ================================
        04. mobile menu 
    ================================ */
  var thMenuWrap = $('.th-mobile-menu-active > ul').clone();
  var thSideMenu = $('.th-offcanvas-menu nav');
  thSideMenu.append(thMenuWrap);
  if ($(thSideMenu).find('.sub-menu, .th-mega-menu').length != 0) {
    $(thSideMenu)
      .find('.sub-menu, .th-mega-menu')
      .parent()
      .append('<button class="th-menu-close"><i class="fas fa-chevron-right"></i></button>');
  }
  // Only items that actually have a submenu toggle it; plain links must navigate.
  var sideMenuList = $(
    '.th-offcanvas-menu nav > ul > li button.th-menu-close, .th-offcanvas-menu nav > ul li.has-dropdown > a',
  ).filter(function () {
    return $(this).siblings('.sub-menu, .th-mega-menu').length > 0;
  });
  $(sideMenuList).on('click', function (e) {
    e.preventDefault();
    if (!$(this).parent().hasClass('active')) {
      $(this).parent().addClass('active');
      $(this).siblings('.sub-menu, .th-mega-menu').slideDown();
    } else {
      $(this).siblings('.sub-menu, .th-mega-menu').slideUp();
      $(this).parent().removeClass('active');
    }
  });
  $('.th-offcanvas-toggle').on('click', function (e) {
    e.preventDefault();
    $('.th-offcanvas').addClass('th-offcanvas-open');
    $('.th-offcanvas-overlay').addClass('th-offcanvas-overlay-open');
  });
  $('.th-offcanvas-close-toggle,.th-offcanvas-overlay').on('click', function () {
    $('.th-offcanvas').removeClass('th-offcanvas-open');
    $('.th-offcanvas-overlay').removeClass('th-offcanvas-overlay-open');
  });

  /* ================================
       05. Nice Select Js Start
    ================================ */
  if ($('.single-select').length && $.fn.niceSelect) {
    $('.single-select').niceSelect();
  }

  /*----------------------------------------*/
  /*  09. Counter js
/*----------------------------------------*/

  // Count up from 0 once each number scrolls into view (replaces jQuery counterUp + Waypoints)
  var counters = document.querySelectorAll('.count');
  if (counters.length && 'IntersectionObserver' in window &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var countIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        countIO.unobserve(entry.target);
        var el = entry.target, target = parseInt(el.textContent, 10) || 0, start = null;
        (function tick(t) {
          if (start === null) start = t;
          var k = Math.min((t - start) / 1500, 1);
          el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3)));
          if (k < 1) requestAnimationFrame(tick);
        })(performance.now());
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { countIO.observe(el); });
  }

  /* ================================
       06. Mouse Cursor Animation
    ================================ */
  if ($('.mouseCursor').length > 0) {
    function itCursor() {
      var myCursor = jQuery('.mouseCursor');
      if (myCursor.length) {
        if ($('body')) {
          const e = document.querySelector('.cursor-inner'),
            t = document.querySelector('.cursor-outer');
          let n,
            i = 0,
            o = !1;
          window.onmousemove = function (s) {
            if (!o) {
              t.style.transform = 'translate(' + s.clientX + 'px, ' + s.clientY + 'px)';
            }
            e.style.transform = 'translate(' + s.clientX + 'px, ' + s.clientY + 'px)';
            n = s.clientY;
            i = s.clientX;
          };
          $('body').on('mouseenter', 'button, a, .cursor-pointer', function () {
            e.classList.add('cursor-hover');
            t.classList.add('cursor-hover');
          });
          $('body').on('mouseleave', 'button, a, .cursor-pointer', function () {
            if (!($(this).is('a', 'button') && $(this).closest('.cursor-pointer').length)) {
              e.classList.remove('cursor-hover');
              t.classList.remove('cursor-hover');
            }
          });
          e.style.visibility = 'visible';
          t.style.visibility = 'visible';
        }
      }
    }
    itCursor();
  }

  /* ================================
		07. popup image
	================================ */
  if ($.fn.magnificPopup) $('.popup-image').magnificPopup({
    type: 'image',
  });
  /* ================================
		08. popup video
	================================ */
  if ($.fn.magnificPopup) $('.popup-video').magnificPopup({
    type: 'iframe',
  });

  /* ================================
        10. Aos Animation
    ================================ */
  AOS.init({
    duration: 1000,
    once: true,
  });

  // counter 1
  setTimeout(() => {
    let el = document.getElementById('count');

    if (el) {
      el.innerHTML = 20;
    }
  }, 500);

  // counter 2
  setTimeout(() => {
    const el = document.getElementById('count2');

    if (el) {
      el.innerHTML = 98;
    }
  }, 500);

  /* ================================
      Testimonial Active (Home 1)
  ================================ */

  if ($('.thtestimonialactive1').length) {
    const thtestimonialactive1 = new Swiper('.thtestimonialactive1', {
      slidesPerView: 2,
      spaceBetween: 30,
      centeredSlides: true,
      keyboard: {
        enabled: true,
      },
      loop: true,
      speed: 3000,
      keyboard: {
        enabled: true,
      },
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.th-testimonial-navigation-next',
        prevEl: '.th-testimonial-navigation-prev',
      },
      breakpoints: {
        0: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 2,
        },
        992: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 2,
        },
        1200: {
          slidesPerView: 3,
        },
      },
    });
  }

  /* ================================
      Testimonial Active (Home 1)
  ================================ */

  if ($('.thtestimonialactive31').length) {
    const thtestimonialactive31 = new Swiper('.thtestimonialactive31', {
      slidesPerView: 3,
      spaceBetween: 30,
      centeredSlides: true,
      keyboard: {
        enabled: true,
      },
      loop: true,
      speed: 3000,
      keyboard: {
        enabled: true,
      },
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.th-testimonial-navigation-next',
        prevEl: '.th-testimonial-navigation-prev',
      },
      breakpoints: {
        0: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 2,
        },
        992: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 2,
        },
        1200: {
          slidesPerView: 3,
        },
      },
    });
  }

  /* ================================
      Testimonial Active (Home 2)
  ================================ */

  if ($('.thtestimonialactive2').length) {
    const thtestimonialactive2 = new Swiper('.thtestimonialactive2', {
      slidesPerView: 3,
      spaceBetween: 30,
      keyboard: {
        enabled: true,
      },
      loop: true,
      speed: 3000,
      keyboard: {
        enabled: true,
      },
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: '.th-testimonial-navigation-next',
        prevEl: '.th-testimonial-navigation-prev',
      },
      breakpoints: {
        0: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 2,
        },
        992: {
          slidesPerView: 2,
        },
        1200: {
          slidesPerView: 3,
        },
      },
    });
  }

  /* ================================
      Testimonial Active (Home 3)
  ================================ */

  if ($('.thtestimonialactive3').length) {
    const thtestimonialactive3 = new Swiper('.thtestimonialactive3', {
      slidesPerView: 2,
      spaceBetween: 30,
      keyboard: {
        enabled: true,
      },
      loop: true,
      speed: 3000,
      keyboard: {
        enabled: true,
      },
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: '.th-testimonial-navigation-next',
        prevEl: '.th-testimonial-navigation-prev',
      },
      breakpoints: {
        0: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 1,
        },
        992: {
          slidesPerView: 1,
        },
        1200: {
          slidesPerView: 2,
        },
      },
    });
  }

  // brand slider
  var swiper = new Swiper('.tp-brand-top-active', {
    slidesPerView: 'auto',
    freemode: true,
    centeredSlides: true,
    loop: true,
    speed: 4000,
    allowTouchMove: false,
    autoplay: {
      delay: 1,
      disableOnInteraction: true,
    },
  });

  // brand slider
  var swiper = new Swiper('.tp-brand-bottom-active', {
    slidesPerView: 'auto',
    freemode: true,
    centeredSlides: true,
    loop: true,
    speed: 4000,
    allowTouchMove: false,
    autoplay: {
      delay: 1,
      disableOnInteraction: true,
    },
  });

  // Work Swiper
  var swiper = new Swiper('.th-work-Swiper', {
    spaceBetween: 30,
    loop: true,
    speed: 750,
    centeredSlides: true,

    breakpoints: {
      0: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 2,
      },
      992: {
        slidesPerView: 2,
      },
      1200: {
        slidesPerView: 4,
      },
    },

    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
  });

  // portfolio slider 2

  var swiper = new Swiper('.thportfoloSwiper', {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    loop: true,
    coverflowEffect: {
      rotate: 0,
      stretch: 0,
      depth: 200,
      modifier: 2,
      slideShadows: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });


  // new swiper 

  

  // Reveal animation //
  const hoverItem = document.querySelectorAll('.hover-reveal-item');
  function moveImage(e, hoverItem) {
    const item = hoverItem.getBoundingClientRect();
    const x = e.clientX - item.x;
    const y = e.clientY - item.y;
    if (hoverItem.children[1]) {
      hoverItem.children[1].style.transform = `translate(${x}px, ${y}px)`;
    }
  }
  hoverItem.forEach((item, i) => {
    item.addEventListener('mousemove', (e) => {
      moveImage(e, item);
    });
  });

  // th-swiper pagination

  whenReady(function () {
    const swiper = new Swiper('.premiumSwiper', {
      loop: true,
      speed: 1000,
      centeredSlides: true,
      slidesPerView: 1,
      spaceBetween: 30,
      navigation: {
        nextEl: '.next',
        prevEl: '.prev',
      },
    });

    const numbers = document.querySelectorAll('.th-vertical-pagination span');

    numbers.forEach((el) => {
      el.addEventListener('click', function () {
        swiper.slideToLoop(this.dataset.slide);
      });
    });

    swiper.on('slideChange', function () {
      const realIndex = swiper.realIndex;
      numbers.forEach((n) => n.classList.remove('active'));
      numbers[realIndex].classList.add('active');
    });
  });

  // data-bg
  $('[data-background]').each(function () {
    $(this).css('background-image', 'url(' + $(this).attr('data-background') + ')');
  });

  // priceing table

  whenReady(function () {
    const toggle = document.getElementById('priceToggle');
    const prices = document.querySelectorAll('.th-price');

    if (toggle) {
      toggle.addEventListener('change', function () {
        prices.forEach((price) => {
          if (this.checked) {
            price.innerHTML = '$' + price.dataset.year;
          } else {
            price.innerHTML = '$' + price.dataset.month;
          }
        });
      });
    }
  });

  /*---- Portfolio Slide ----*/
  var swiper = new Swiper('.swiper2slider', {
    effect: 'coverflow',
    centeredSlides: true,
    loop: true,
    speed: 1000,
    slidesPerView: 'auto',
    coverflowEffect: {
      rotate: 0,
      stretch: 0,
      depth: 240,
      modifier: 7,
      slideShadows: false,
    },
    keyboard: {
      enabled: true,
    },
    navigation: {
      nextEl: '.th-testimonial-navigation-next',
      prevEl: '.th-testimonial-navigation-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    breakpoints: {
      640: { slidesPerView: 1.6 },
      768: { slidesPerView: 1.6 },
      1024: { slidesPerView: 1.6 },
      1560: { slidesPerView: 1.6 },
    },
  });


  // testimonial slider 

var thSwiper = new Swiper(".thHeroSwiper", {
    loop: true,
    speed: 800,
    autoplay: {
          delay: 3000, 
          disableOnInteraction: false, // stop on hover/click না
      },


    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },

    navigation: {
        nextEl: ".th-testimonial-navigation-next",
        prevEl: ".th-testimonial-navigation-prev",
    },

    on: {
        slideChange: function () {

            let index = this.realIndex;

            document.querySelectorAll(".th-num1").forEach((el)=>{
                el.classList.remove("th-active");
            });

            document.querySelector('.th-num1[data-slide="'+index+'"]').classList.add("th-active");
        }
    }
});


// number click
document.querySelectorAll(".th-num1").forEach((btn)=>{

    btn.addEventListener("click", function(){

        let index = this.getAttribute("data-slide");

        thSwiper.slideToLoop(index);

    });

});



  /* ================================
      Operational standards console:
      fill the gauges and count up once, when it scrolls into view
  ================================ */
  document.querySelectorAll('.pt-console').forEach(function (consoleEl) {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) return;
    var nums = consoleEl.querySelectorAll('.pt-meter-num');
    consoleEl.classList.add('is-armed');
    nums.forEach(function (n) { n.textContent = '0'; });
    var io = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      // let the armed (empty) state paint before starting the transition
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { consoleEl.classList.add('is-live'); });
      });
      nums.forEach(function (n, i) {
        var target = +n.getAttribute('data-target') || 100;
        var delay = i * 180 + 150, dur = 1400, start = null;
        setTimeout(function () {
          (function tick(t) {
            if (start === null) start = t;
            var k = Math.min((t - start) / dur, 1);
            n.textContent = Math.round(target * (1 - Math.pow(1 - k, 3)));
            if (k < 1) requestAnimationFrame(tick);
          })(performance.now());
        }, delay);
      });
    }, { threshold: 0.35 });
    io.observe(consoleEl);
  });

})(jQuery);



