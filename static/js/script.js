// first slicder or container
        document.addEventListener("DOMContentLoaded", function() {
            const slideshow = document.querySelector('.first-slideshow');
            const slides = document.querySelectorAll('.first-slide');
            const prevBtn = document.getElementById('firstPrevBtn');
            const nextBtn = document.getElementById('firstNextBtn');
            const dotsContainer = document.getElementById('firstDotsContainer');
            
            let currentIndex = 0;
            const totalSlides = slides.length;

            // create dots
            slides.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.classList.add('first-dot');
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(index));
                dotsContainer.appendChild(dot);
            });

            const dots = document.querySelectorAll('.first-dot');

            function updateSlideshow() {
                slideshow.style.transform = `translateX(-${currentIndex * 100}%)`;
                
                // update active dot
                dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentIndex);
                });
            }

            function goToSlide(index) {
                currentIndex = index;
                updateSlideshow();
            }

            function nextSlide() {
                currentIndex = (currentIndex + 1) % totalSlides;
                updateSlideshow();
            }

            function prevSlide() {
                currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
                updateSlideshow();
            }

            // wheh click in button redirect forward or near
            prevBtn.addEventListener('click', prevSlide);
            nextBtn.addEventListener('click', nextSlide);

            // Auto-slide every 5000 mili secont mean 5 seconds
            let slideInterval = setInterval(nextSlide, 5000);

           
            slideshow.addEventListener('mouseenter', () => {
                clearInterval(slideInterval);
            });

            slideshow.addEventListener('mouseleave', () => {
                slideInterval = setInterval(nextSlide, 5000);
            });
        });

        // second slicer 
        function initSecondSlider() {
            const slider = document.querySelector('.second-slider');
            const slides = document.querySelectorAll('.second-slide');
            const videos = document.querySelectorAll('.second-slide video');
            const prevBtn = document.getElementById('secondPrevBtn');
            const nextBtn = document.getElementById('secondNextBtn');
            
            let currentIndex = 0;
            const totalSlides = slides.length;
            let autoSlideInterval;

            function updateSlider() {
                slider.style.transform = `translateX(-${currentIndex * 100}%)`;
                // Pause all videos except the  current one
                videos.forEach((video, index) => {
                    if (index === currentIndex) {
                        video.play().catch(e => console.log("Auto-play prevented:", e));
                    } else {
                        video.pause();
                    }
                });
            }

            function nextSlide() {
                currentIndex = (currentIndex + 1) % totalSlides;
                updateSlider();
                resetAutoSlide();
            }

            function prevSlide() {
                currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
                updateSlider();
                resetAutoSlide();
            }

            function startAutoSlide() {
                autoSlideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
            }

            function resetAutoSlide() {
                clearInterval(autoSlideInterval);
                startAutoSlide();
            }

            nextBtn.addEventListener('click', nextSlide);
            prevBtn.addEventListener('click', prevSlide);


            updateSlider(); 
            startAutoSlide(); 
        
            videos[0].play().catch(e => {
                console.log("Auto-play prevented, adding play button fallback");
            });
        }

       
        document.addEventListener("DOMContentLoaded", function() {
            initSecondSlider();
        });