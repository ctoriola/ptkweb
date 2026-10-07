
/***************************************************
==================== JS INDEX ======================
****************************************************
01.text animation
02.image musking animation
03.image revel animation


****************************************************/


(function($){
    "use strict";

/*----------------------------------------*/
/*  01.text animation
/*----------------------------------------*/
function initHeadingAnimation() {
    if($('.text-effect').length) {
			var textheading = $(".text-effect");

			if(textheading.length === 0) return; gsap.registerPlugin(SplitText); textheading.each(function(index, el) {
				
				el.split = new SplitText(el, { 
					type: "lines,words,chars",
					linesClass: "split-line"
				});
				
				if( $(el).hasClass('text-effect') ){
					gsap.set(el.split.chars, {
						opacity: .3,
						x: "-7",
					});
				}
				el.anim = gsap.to(el.split.chars, {
					scrollTrigger: {
						trigger: el,
						start: "top 92%",
						end: "top 60%",
						markers: false,
						scrub: 1,
					},

					x: "0",
					y: "0",
					opacity: 1,
					duration: .7,
					stagger: 0.2,
				});
				
			});
		}
        if ($('.text-anime-style-1').length) {
			let staggerAmount 	= 0.05,
				translateXValue = 0,
				delayValue 		= 0.5,
			   animatedTextElements = document.querySelectorAll('.text-anime-style-1');
			
			animatedTextElements.forEach((element) => {
				let animationSplitText = new SplitText(element, { type: "chars, words" });
					gsap.from(animationSplitText.words, {
					duration: 1,
					delay: delayValue,
					x: 20,
					autoAlpha: 0,
					stagger: staggerAmount,
					scrollTrigger: { trigger: element, start: "top 85%" },
					});
			});		
		}
		
		if ($('.text-anime-style-2').length) {				
			let	 staggerAmount 		= 0.03,
				 translateXValue	= 20,
				 delayValue 		= 0.1,
				 easeType 			= "power2.out",
				 animatedTextElements = document.querySelectorAll('.text-anime-style-2');
			
			animatedTextElements.forEach((element) => {
				let animationSplitText = new SplitText(element, { type: "chars, words" });
					gsap.from(animationSplitText.chars, {
						duration: 1,
						delay: delayValue,
						x: translateXValue,
						autoAlpha: 0,
						stagger: staggerAmount,
						ease: easeType,
						scrollTrigger: { trigger: element, start: "top 85%"},
					});
			});		
		}
		
		if ($('.text-anime-style-3').length) {		
			let	animatedTextElements = document.querySelectorAll('.text-anime-style-3');
			
			 animatedTextElements.forEach((element) => {
				//Reset if needed
				if (element.animation) {
					element.animation.progress(1).kill();
					element.split.revert();
				}

				element.split = new SplitText(element, {
					type: "lines,words,chars",
					linesClass: "split-line",
				});
				gsap.set(element, { perspective: 400 });

				gsap.set(element.split.chars, {
					opacity: 0,
					x: "50",
				});

				element.animation = gsap.to(element.split.chars, {
					scrollTrigger: { trigger: element,	start: "top 90%" },
					x: "0",
					y: "0",
					rotateX: "0",
					opacity: 1,
					duration: 1,
					ease: Back.easeOut,
					stagger: 0.02,
				});
			});		
		}
	}
	
	if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
            initHeadingAnimation();
        });
    } else {
        window.addEventListener("load", initHeadingAnimation);
  }


/*----------------------------------------*/
/*  02.image musking animation
/*----------------------------------------*/  
    //image cliping effect
    document.addEventListener("DOMContentLoaded", () => {
        const initialClipPaths = [
            "polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)",
            "polygon(33.33% 0%, 33.33% 0%, 33.33% 0%, 33.33% 0%)",
            "polygon(65.66% 0%, 66.66% 0%, 66.66% 0%, 66.66% 0%)",
            "polygon(0% 33.33%, 0% 33.33%, 0% 33.33%, 0% 33.33%)",
            "polygon(33.33% 33.33%, 33.33% 33.33%, 33.33% 33.33%, 33.33% 33.33%)",
            "polygon(65.66% 33.33%, 66.66% 33.33%, 66.66% 33.33%, 66.66% 33.33%)",
            "polygon(0% 66.66%, 0% 66.66%, 0% 66.66%, 0% 66.66%)",
            "polygon(33.33% 66.66%, 33.33% 66.66%, 33.33% 66.66%, 33.33% 66.66%)",
            "polygon(65.66% 66.66%, 66.66% 66.66%, 66.66% 66.66%, 66.66% 66.66%)"
        ];

        const finalClipPaths = [
            "polygon(0% 0%, 34.33% 0%, 34.33% 34.33%, 0% 34.33%)",
            "polygon(32.33% 0%, 66.66% 0%, 66.66% 33.33%, 33.33% 34.33%)",
            "polygon(65.66% 0%, 100% 0%, 100% 33.33%, 65.66% 34.33%)",
            "polygon(0% 33.33%, 33.33% 33.33%, 33.33% 66.66%, 0% 66.66%)",
            "polygon(30.33% 33.33%, 66.66% 33.33%, 66.66% 66.66%, 33.33% 66.66%)",
            "polygon(65.66% 33.33%, 100% 32.33%, 100% 66.66%, 65.66% 66.66%)",
            "polygon(0% 65.66%, 33.33% 66.66%, 33.33% 100%, 0% 100%)",
            "polygon(30.33% 66.66%, 66.66% 65.66%, 66.66% 100%, 33.33% 100%)",
            "polygon(65.66% 66.66%, 100% 65.66%, 100% 100%, 65.66% 100%)"
        ];

        // Create mask divs for each wrapper
        document.querySelectorAll(".vl-clip-anim").forEach(wrapper => {
            const img = wrapper.querySelector(".vl-anim-img[data-animate='true']");
            if (!img) return;
            const url = img.src;

            // Remove old masks if any (reuse safe)
            wrapper.querySelectorAll(".mask").forEach(m => m.remove());

            for (let i = 0; i < 9; i++) {
                const mask = document.createElement("div");
                mask.className = `mask mask-${i + 1}`;
                Object.assign(mask.style, {
                    backgroundImage: `url(${url})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    position: "absolute",
                    inset: "0"
                });
                wrapper.appendChild(mask);
            }
        });

        // Animate masks
        gsap.utils.toArray(".vl-clip-anim").forEach(wrapper => {
            const masks = wrapper.querySelectorAll(".mask");
            if (!masks.length) return;

            gsap.set(masks, { clipPath: (i) => initialClipPaths[i] });

            const order = [
                [".mask-1"],
                [".mask-2", ".mask-4"],
                [".mask-3", ".mask-5", ".mask-7"],
                [".mask-6", ".mask-8"],
                [".mask-9"]
            ];

            const tl = gsap.timeline({
                scrollTrigger: { trigger: wrapper, start: "top 75%" }
            });

            order.forEach((targets, i) => {
                const validTargets = targets
                    .map(c => wrapper.querySelector(c))
                    .filter(el => el); // filter out nulls

                if (validTargets.length) {
                    tl.to(validTargets, {
                        clipPath: (j, el) => finalClipPaths[Array.from(masks).indexOf(el)],
                        duration: 1,
                        ease: "power4.out",
                        stagger: 0.1
                    }, i * 0.125);
                }
            });
        });
    });


	const headings = document.querySelectorAll('.text-scale-anim');
	headings.forEach(heading => {
		const textNodes = [];
		heading.childNodes.forEach(node => {
			if (node.nodeType === Node.TEXT_NODE) {
				node.textContent.split(' ').forEach((word, index, array) => {
					const wordSpan = document.createElement('span');
					wordSpan.classList.add('tp-word-span');
					word.split('').forEach(letter => {
						const letterSpan = document.createElement('span');
						letterSpan.classList.add('tp-letter-span');
						letterSpan.textContent = letter;
						wordSpan.appendChild(letterSpan);
					});
					textNodes.push(wordSpan);
					if (index < array.length - 1) {
						textNodes.push(document.createTextNode(' '));
					}
				});
			} else if (node.nodeType === Node.ELEMENT_NODE) {
				textNodes.push(node.cloneNode(true));
			}
		});
		heading.innerHTML = '';
		textNodes.forEach(node => heading.appendChild(node));

		const letters = heading.querySelectorAll('.tp-letter-span');
		letters.forEach((letter, index) => {
			$(letter).on('mouseenter', () => {
				// center letter
				gsap.to(letter, {
					scaleY: 1.6,
					y: '-24%',
					duration: 0.4,
					ease: 'sine'
				});

				// left neighbor
				const prev = letters[index - 1];
				if (prev) {
					gsap.to(prev, {
						scaleY: 1.3,
						y: '-12%',
						duration: 0.4,
						ease: 'sine'
					});
				}

				// right neighbor
				const next = letters[index + 1];
				if (next) {
					gsap.to(next, {
						scaleY: 1.3,
						y: '-12%',
						duration: 0.4,
						ease: 'sine'
					});
				}
			});

			$(letter).on('mouseleave', () => {
				// reset center letter
				gsap.to(letter, {
					scaleY: 1,
					y: '0%',
					duration: 0.4,
					ease: 'sine'
				});

				// reset left and right neighbors
				const prev = letters[index - 1];
				const next = letters[index + 1];
				[prev, next].forEach(el => {
					if (el) {
						gsap.to(el, {
							scaleY: 1,
							y: '0%',
							duration: 0.4,
							ease: 'sine'
						});
					}
				});
			});
		});
	});


/*----------------------------------------*/
/*  03.image revel animation
/*----------------------------------------*/  
   if($('.reveal').length){gsap.registerPlugin(ScrollTrigger);let revealContainers=document.querySelectorAll(".reveal");revealContainers.forEach((container)=>{let image=container.querySelector("img");let tl=gsap.timeline({scrollTrigger:{trigger:container,toggleActions:"play none none none"}});tl.set(container,{autoAlpha:1});tl.from(container,1.5,{xPercent:-100,ease:Power2.out});tl.from(image,1.5,{xPercent:100,scale:1.3,delay:-1.5,ease:Power2.out});});}





    

})(jQuery);



