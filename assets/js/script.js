// Fade in animation on scroll
document.addEventListener('DOMContentLoaded', function() {
    // Get all elements with fade-in class
    const fadeElements = document.querySelectorAll('.fade-in');
    
    // Create intersection observer for fade-in animations
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe all fade-in elements
    fadeElements.forEach(element => {
        fadeObserver.observe(element);
    });
    
    // Video player functionality with performance optimizations
    const videoData = [
        {
            src: 'assets/vids/1.mp4',
            title: 'Happy Birthday, Beautiful! 💖',
            wish: 'Your beauty lights up my world. Happy Birthday!',
            loaded: false
        },
        {
            src: 'assets/vids/2.mp4',
            title: 'A Special Day for You ✨',
            wish: 'Your smile is magical. ',
            loaded: false
        },
        {
            src: 'assets/vids/3.mp4',
            title: 'Celebrating You Today 🎉',
            wish: 'You\'re a really sweet person.',
            loaded: false
        },
        {
            src: 'assets/vids/4.mp4',
            title: 'Wishing You the Best 🌟',
            wish: 'May all your dreams come true, love.',
            loaded: false
        },
        {
            src: 'assets/vids/5.mp4',
            title: 'You Deserve the World 🌍',
            wish: 'Your smile is my favorite thing. Love you!',
            loaded: false
        },
        {
            src: 'assets/vids/6.mp4',
            title: 'Happy Birthday, Subomi! 🎂',
            wish: 'You\'re absolutely beautiful. Happy Birthday Subomi!',
            loaded: false
        }
    ];

    let currentVideoIndex = 0;
    const videoPlayer = document.getElementById('videoPlayer');
    const videoModal = document.getElementById('videoModal');
    const videoTitle = document.getElementById('videoTitle');
    const videoWish = document.getElementById('videoWish');
    const videoOverlay = document.querySelector('.video-overlay');
    const giftBox = document.querySelector('.gift-box');

    // Gift box click handler
    giftBox.addEventListener('click', function() {
        startVideoPlaylist();
    });

    // Start video playlist with loading optimization
    function startVideoPlaylist() {
        currentVideoIndex = 0;
        videoModal.style.display = 'block';
        
        // Show loading state
        videoTitle.textContent = 'Loading...';
        videoWish.textContent = 'Please wait while we prepare your gift...';
        videoOverlay.classList.add('show');
        
        // Preload first video
        preloadVideo(0, () => {
            playCurrentVideo();
        });
    }

    // Preload video function with mobile optimization
    function preloadVideo(index, callback) {
        if (index >= videoData.length) {
            callback();
            return;
        }

        const video = videoData[index];
        if (video.loaded) {
            callback();
            return;
        }

        const tempVideo = document.createElement('video');
        tempVideo.muted = true;
        tempVideo.preload = 'metadata';
        tempVideo.playsinline = true;
        
        // Mobile-specific optimizations
        if (window.innerWidth <= 768) {
            tempVideo.preload = 'none';
        }
        
        tempVideo.addEventListener('loadedmetadata', function() {
            video.loaded = true;
            if (index === 0) {
                callback();
            }
        });

        tempVideo.addEventListener('error', function() {
            console.log('Error loading video:', video.src);
            if (index === 0) {
                callback();
            }
        });

        tempVideo.src = video.src;
    }

    // Play current video with mobile performance optimizations
    function playCurrentVideo() {
        if (currentVideoIndex >= videoData.length) {
            // All videos played, close modal
            videoModal.style.display = 'none';
            return;
        }

        const currentVideo = videoData[currentVideoIndex];
        
        // Mobile-specific preloading (only preload next video on larger screens)
        if (window.innerWidth > 768 && currentVideoIndex + 1 < videoData.length) {
            preloadVideo(currentVideoIndex + 1);
        }

        videoPlayer.src = currentVideo.src;
        videoTitle.textContent = currentVideo.title;
        videoWish.textContent = currentVideo.wish;

        // Show overlay with message
        videoOverlay.classList.add('show');

        // Mobile-optimized play with reduced overlay time
        const overlayTime = window.innerWidth <= 768 ? 2000 : 3000;
        
        const playPromise = videoPlayer.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                // Hide overlay after shorter time on mobile
                setTimeout(() => {
                    videoOverlay.classList.remove('show');
                }, overlayTime);
            }).catch(error => {
                console.log('Video play error:', error);
                // Continue to next video if current fails
                setTimeout(() => {
                    currentVideoIndex++;
                    playCurrentVideo();
                }, 1000);
            });
        }
    }

    // Touch and hold functionality for videos with mobile optimization
    let touchTimer = null;
    let isPaused = false;

    // Touch start event with mobile optimization
    videoPlayer.addEventListener('touchstart', function(e) {
        e.preventDefault();
        const holdTime = window.innerWidth <= 768 ? 300 : 500; // Faster response on mobile
        touchTimer = setTimeout(() => {
            if (!videoPlayer.paused) {
                videoPlayer.pause();
                isPaused = true;
                showPauseOverlay();
            }
        }, holdTime);
    });

    // Touch end event
    videoPlayer.addEventListener('touchend', function(e) {
        e.preventDefault();
        if (touchTimer) {
            clearTimeout(touchTimer);
            touchTimer = null;
        }
        
        if (isPaused) {
            videoPlayer.play();
            isPaused = false;
            hidePauseOverlay();
        }
    });

    // Touch move event (cancel hold if user moves finger)
    videoPlayer.addEventListener('touchmove', function(e) {
        if (touchTimer) {
            clearTimeout(touchTimer);
            touchTimer = null;
        }
    });

    // Mouse events for desktop
    let mouseTimer = null;
    let isMousePaused = false;

    videoPlayer.addEventListener('mousedown', function(e) {
        const holdTime = window.innerWidth <= 768 ? 300 : 500; // Faster response on mobile
        mouseTimer = setTimeout(() => {
            if (!videoPlayer.paused) {
                videoPlayer.pause();
                isMousePaused = true;
                showPauseOverlay();
            }
        }, holdTime);
    });

    videoPlayer.addEventListener('mouseup', function(e) {
        if (mouseTimer) {
            clearTimeout(mouseTimer);
            mouseTimer = null;
        }
        
        if (isMousePaused) {
            videoPlayer.play();
            isMousePaused = false;
            hidePauseOverlay();
        }
    });

    videoPlayer.addEventListener('mouseleave', function(e) {
        if (mouseTimer) {
            clearTimeout(mouseTimer);
            mouseTimer = null;
        }
    });

    // Show pause overlay with mobile optimization
    function showPauseOverlay() {
        const pauseOverlay = document.createElement('div');
        pauseOverlay.className = 'pause-overlay';
        const isMobile = window.innerWidth <= 768;
        pauseOverlay.innerHTML = `
            <div class="pause-message">
                <i class="fas fa-pause"></i>
                <p>${isMobile ? 'Tap & hold to pause' : 'Hold to pause • Release to resume'}</p>
            </div>
        `;
        document.querySelector('.video-player-container').appendChild(pauseOverlay);
    }

    // Hide pause overlay
    function hidePauseOverlay() {
        const pauseOverlay = document.querySelector('.pause-overlay');
        if (pauseOverlay) {
            pauseOverlay.remove();
        }
    }

    // Video ended event
    videoPlayer.addEventListener('ended', function() {
        currentVideoIndex++;
        playCurrentVideo();
    });

    // Close modal on background click
    videoModal.addEventListener('click', function(e) {
        if (e.target === videoModal) {
            videoModal.style.display = 'none';
        }
    });

    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && videoModal.style.display === 'block') {
            videoModal.style.display = 'none';
        }
    });
    
    // Smooth scrolling for arrow links
    const scrollArrows = document.querySelectorAll('.scroll-arrow');
    
    scrollArrows.forEach(arrow => {
        arrow.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add some initial animations
    setTimeout(() => {
        const heroElements = document.querySelectorAll('#hero .fade-in');
        heroElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('visible');
            }, index * 200);
        });
    }, 500);
});

// Add some sparkle effects to the cake
function addSparkles() {
    const cake = document.querySelector('.cake');
    if (!cake) return;
    
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: #ffd700;
                border-radius: 50%;
                pointer-events: none;
                animation: sparkle 2s ease-out forwards;
                left: ${Math.random() * 200}px;
                top: ${Math.random() * 200}px;
            `;
            
            cake.appendChild(sparkle);
            
            setTimeout(() => {
                sparkle.remove();
            }, 2000);
        }, i * 300);
    }
}

// Add sparkle animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes sparkle {
        0% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
        }
        50% {
            opacity: 1;
            transform: scale(1) rotate(180deg);
        }
        100% {
            opacity: 0;
            transform: scale(0) rotate(360deg);
        }
    }
`;
document.head.appendChild(style);

// Trigger sparkles periodically
setInterval(addSparkles, 5000);

// Add some interactive effects
document.addEventListener('mousemove', function(e) {
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        heroSection.style.background = `
            linear-gradient(
                ${135 + x * 30}deg, 
                #fce4ec 0%, 
                #f8bbd9 ${50 + y * 20}%, 
                #fce4ec 100%
            )
        `;
    }
}); 