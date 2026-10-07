(function ($) {
	"use strict";
	/*---- Portfolio Slide ----*/
	var pbmit_portfolio_slide = function () {
		var swiper = new Swiper(".swiper", {
			effect: "coverflow",
			centeredSlides: true,
			loop: true,
			speed: 1000,
			slidesPerView: 'auto',
			coverflowEffect: {
				rotate: 0,
				stretch: 0,
				depth: 	240,   // ↓ lower depth = sharper text
				modifier: 7,
				shadow: false,
				slideShadows: false
			},
			keyboard: {
				enabled: true
			},
			pagination: {
				el: ".swiper-pagination",
				clickable: true
			},
			breakpoints: {
				640: { slidesPerView: 1.6 },
				768: { slidesPerView: 1.6 },
				1024: { slidesPerView: 1.6  },
				1560: { slidesPerView: 1.6  }
			}
		});
	};
	// on load
	jQuery(window).on('load', function(){
		pbmit_portfolio_slide();
	});
})($);