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
09. preloader
10. Aos Animation



****************************************************/

(function ($) {
  'use strict';

  /* ================================
        01. stiky js
    ================================ */
  var windowOn = $(window);
  windowOn.on('scroll', function () {
    var scroll = windowOn.scrollTop();
    if (scroll < 100) {
      $('.th-header-sticky').removeClass('header-sticky');
    } else {
      $('.th-header-sticky').addClass('header-sticky');
    }
  });

  /* ================================
        02. back-to-top
    ================================ */
  var progressPath = document.querySelector('.progress-wrap path');
  var pathLength = progressPath.getTotalLength();
  progressPath.style.transition = progressPath.style.WebkitTransition = 'none';
  progressPath.style.strokeDasharray = pathLength + ' ' + pathLength;
  progressPath.style.strokeDashoffset = pathLength;
  progressPath.getBoundingClientRect();
  progressPath.style.transition = progressPath.style.WebkitTransition = 'stroke-dashoffset 10ms linear';
  var updateProgress = function () {
    var scroll = $(window).scrollTop();
    var height = $(document).height() - $(window).height();
    var progress = pathLength - (scroll * pathLength) / height;
    progressPath.style.strokeDashoffset = progress;
  };
  updateProgress();
  $(window).scroll(updateProgress);
  var offset = 50;
  var duration = 550;
  jQuery(window).on('scroll', function () {
    if (jQuery(this).scrollTop() > offset) {
      jQuery('.progress-wrap').addClass('active-progress');
    } else {
      jQuery('.progress-wrap').removeClass('active-progress');
    }
  });
  jQuery('.progress-wrap').on('click', function (event) {
    event.preventDefault();
    jQuery('html, body').animate({ scrollTop: 0 }, duration);
    return false;
  });

  /* ================================
       03. Parallaxie
    ================================ */

  var $window = $(window);
  var $parallaxie = $('.parallaxie');

  if ($parallaxie.length && $window.width() > 991) {
    if ($window.width() > 768) {
      $parallaxie.parallaxie({
        speed: 0.55,
        offset: 0,
      });
    }
  }

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
  var sideMenuList = $(
    '.th-offcanvas-menu nav > ul > li button.th-menu-close, .th-offcanvas-menu nav > ul li.has-dropdown > a',
  );
  $(sideMenuList).on('click', function (e) {
    console.log(e);
    e.preventDefault();
    if (!$(this).parent().hasClass('active')) {
      $(this).parent().addClass('active');
      $(this).siblings('.sub-menu, .th-mega-menu').slideDown();
    } else {
      $(this).siblings('.sub-menu, .th-mega-menu').slideUp();
      $(this).parent().removeClass('active');
    }
  });
  $('.th-offcanvas-toggle').on('click', function () {
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
  if ($('.single-select').length) {
    $('.single-select').niceSelect();
  }

  /*----------------------------------------*/
  /*  09. Counter js
/*----------------------------------------*/

 $(document).ready(function () {
  if ($('.count').length > 0) {
    $('.count').counterUp({
      delay: 15,
      time: 4000,
    });
  }
});

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
      Preloader Js Start
    ================================ */

  function preloader() {
    $(window).on('load', function () {
      const svg = document.getElementById('svg');
      if (!svg) return; // safety check if SVG not found

      const tl = gsap.timeline();

      const curve = 'M0 502S175 272 500 272s500 230 500 230V0H0Z';
      const flat = 'M0 2S175 1 500 1s500 1 500 1V0H0Z';

      // Animate preloader text (if exists)
      if ($('.preloader-text').length) {
        tl.to('.preloader-text', {
          delay: 0.3,
          y: -100,
          opacity: 0,
          duration: 0.5,
          ease: 'power2.out',
        });
      }

      // Animate SVG wave
      tl.to(svg, {
        duration: 0.3,
        attr: { d: curve },
        ease: 'power2.in',
      }).to(svg, {
        duration: 0.5,
        attr: { d: flat },
        ease: 'power2.out',
      });

      // Slide preloader up and hide
      tl.to('.preloader', {
        y: -1500,
        duration: 0.8,
        ease: 'power2.inOut',
      }).set('.preloader', { display: 'none', zIndex: -1 });

      // Animate main hero image
      if ($('.animated-image').length) {
        tl.fromTo(
          '.animated-image',
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
          },
          '-=0.3',
        );
      }
    });
  }
  // Init preloader
  preloader();

  /* ================================
		07. popup image
	================================ */
  $('.popup-image').magnificPopup({
    type: 'image',
  });
  /* ================================
		08. popup video
	================================ */
  $('.popup-video').magnificPopup({
    type: 'iframe',
  });

  /* ================================
		09. preloader
	================================ */
  $(window).on('load', function (event) {
    setTimeout(function () {
      $('.preloader').fadeToggle();
    }, 200);
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
      setInterval(moveImage(e, item), 100);
    });
  });

  // th-swiper pagination

  document.addEventListener('DOMContentLoaded', function () {
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

  document.addEventListener('DOMContentLoaded', function () {
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


})(jQuery);



