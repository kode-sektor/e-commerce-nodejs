		let carousel = document.getElementById('slider');
		const indicators = carousel.querySelectorAll('.indicator');	// Fetch indicators
		let slides = '';
		let speed = 5000; 

		function hideCarousel(num, indicators) {
		    indicators[num].setAttribute('data-state', '');
		    slides[num].setAttribute('data-state', '');

		    slides[num].style.opacity=0;
		}

		function showCarousel(num) {

			// Show the slider in target
		    indicators[num].checked = true;
		    indicators[num].setAttribute('data-state', 'active');
		    slides[num].setAttribute('data-state', 'active');

		    slides[num].style.opacity=1;
		}

		function setSlide(slide, indicators) {
		    return function() {
		        // Reset all slides
		        for (var i = 0; i < indicators.length; i++) {
		            indicators[i].setAttribute('data-state', '');
		            slides[i].setAttribute('data-state', '');
		            
		            hideCarousel(i, indicators);
		        }

		        // Set defined slide as active
		        indicators[slide].setAttribute('data-state', 'active');
		        slides[slide].setAttribute('data-state', 'active');
		        showCarousel(slide);

		        // Stop the auto-switcher
		        clearInterval(switcher);
		    };
		}

		function switchSlide(indicators) {

		   let nextSlide = 0;
		    // alert(nextSlide);

		    // Loop across all slides
		    for (let i = 0; i < indicators.length; i++) {
		        // Only move if current slide is active & NOT equal to last slide then increment nextSlide
		        if ((indicators[i].getAttribute('data-state') == 'active') && (i !== (indicators.length-1))) {
		            nextSlide = i + 1;	// Get the index of 'active', then cache the subsequent element as this is the next-to-be active
		        }

		        // Remove all active states & hide
		        hideCarousel(i, indicators);
		    }
		    // alert(nextSlide);

		    // Otherwise, set next slide as active & show the next slide
		    showCarousel(nextSlide);
		}

		if (carousel) {	// If a carousel exists:

		    slides = carousel.querySelectorAll('.slide');	// Fetch slide in DOM

		    // In a timer, loop across the slides
		    let switcher = setInterval(function() {
		        switchSlide(indicators);
		    }, speed);

		    // On click of slide, run setSlide function
		    for (var i = 0; i < indicators.length; i++) {
		        indicators[i].addEventListener("click", setSlide(i, indicators));
		    }
		}
