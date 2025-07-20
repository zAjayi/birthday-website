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
            wish: 'You\'re a really sweet person and yes, that tuck in was necessary. lol',
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
    const closeVideoBtn = document.getElementById('closeVideoBtn');
    const prevVideoBtn = document.getElementById('prevVideoBtn');
    const nextVideoBtn = document.getElementById('nextVideoBtn');

    // Gift box click handler
    giftBox.addEventListener('click', function() {
        startVideoPlaylist();
    });

    // Start video playlist with aggressive mobile optimization
    function startVideoPlaylist() {
        currentVideoIndex = 0;
        videoModal.style.display = 'block';
        
        // Show loading state with spinner
        videoTitle.innerHTML = '<span class="loading-spinner"></span>Loading...';
        videoWish.textContent = 'Please wait while we prepare your gift...';
        videoOverlay.classList.add('show');
        
        // Skip preloading on mobile for faster initial load
        if (window.innerWidth <= 768) {
            setTimeout(() => {
                playCurrentVideo();
            }, 100);
        } else {
            // Preload first video only on desktop
            preloadVideo(0, () => {
                playCurrentVideo();
            });
        }
    }

    // Ultra-fast video loading for mobile
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

        // Skip preloading entirely on mobile for maximum speed
        if (window.innerWidth <= 768) {
            callback();
            return;
        }

        const tempVideo = document.createElement('video');
        tempVideo.muted = true;
        tempVideo.preload = 'metadata';
        tempVideo.playsinline = true;
        tempVideo.disablePictureInPicture = true;
        
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

    // Ultra-fast video playback for mobile
    function playCurrentVideo() {
        if (currentVideoIndex >= videoData.length) {
            // All videos played, close modal
            videoModal.style.display = 'none';
            return;
        }

        const currentVideo = videoData[currentVideoIndex];
        
        // No preloading on mobile - load directly
        videoPlayer.src = currentVideo.src;
        videoTitle.textContent = currentVideo.title;
        videoWish.textContent = currentVideo.wish;

        // Update navigation button states
        updateNavigationButtons();

        // Show overlay with message
        videoOverlay.classList.add('show');

        // Extended overlay time (2 seconds longer)
        const overlayTime = window.innerWidth <= 768 ? 3500 : 5000;
        
        // Immediate play attempt
        const playPromise = videoPlayer.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                // Hide overlay after specified time
                setTimeout(() => {
                    videoOverlay.classList.remove('show');
                }, overlayTime);
            }).catch(error => {
                console.log('Video play error:', error);
                // Show user-friendly error message
                videoTitle.textContent = 'Video loading...';
                videoWish.textContent = 'Please wait a moment...';
                
                // Retry with exponential backoff
                const retryTime = window.innerWidth <= 768 ? 500 : 1000;
                setTimeout(() => {
                    currentVideoIndex++;
                    playCurrentVideo();
                }, retryTime);
            });
        }
    }

    // Update navigation button states
    function updateNavigationButtons() {
        // Previous button
        if (currentVideoIndex === 0) {
            prevVideoBtn.style.opacity = '0.5';
            prevVideoBtn.style.cursor = 'not-allowed';
        } else {
            prevVideoBtn.style.opacity = '1';
            prevVideoBtn.style.cursor = 'pointer';
        }

        // Next button
        if (currentVideoIndex === videoData.length - 1) {
            nextVideoBtn.style.opacity = '0.5';
            nextVideoBtn.style.cursor = 'not-allowed';
        } else {
            nextVideoBtn.style.opacity = '1';
            nextVideoBtn.style.cursor = 'pointer';
        }
    }

    // Play video without overlay (for navigation)
    function playCurrentVideoWithoutOverlay() {
        if (currentVideoIndex >= videoData.length) {
            // All videos played, close modal
            videoModal.style.display = 'none';
            return;
        }

        const currentVideo = videoData[currentVideoIndex];
        
        // Load video directly without overlay
        videoPlayer.src = currentVideo.src;
        videoTitle.textContent = currentVideo.title;
        videoWish.textContent = currentVideo.wish;

        // Update navigation button states
        updateNavigationButtons();

        // Keep overlay hidden for clean viewing
        videoOverlay.classList.remove('show');
        
        // Play video immediately
        const playPromise = videoPlayer.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log('Video play error:', error);
                // Retry on error
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

    // Ultra-fast touch response for mobile
    videoPlayer.addEventListener('touchstart', function(e) {
        e.preventDefault();
        const holdTime = window.innerWidth <= 768 ? 200 : 500; // Ultra-fast response on mobile
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
        const holdTime = window.innerWidth <= 768 ? 200 : 500; // Ultra-fast response on mobile
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

    // Close button functionality
    closeVideoBtn.addEventListener('click', function() {
        videoModal.style.display = 'none';
        videoPlayer.pause();
        currentVideoIndex = 0;
    });

    // Previous video button
    prevVideoBtn.addEventListener('click', function() {
        if (currentVideoIndex > 0) {
            currentVideoIndex--;
            playCurrentVideoWithoutOverlay();
        }
    });

    // Next video button
    nextVideoBtn.addEventListener('click', function() {
        if (currentVideoIndex < videoData.length - 1) {
            currentVideoIndex++;
            playCurrentVideo();
        }
    });

    // Close modal on background click
    videoModal.addEventListener('click', function(e) {
        if (e.target === videoModal) {
            videoModal.style.display = 'none';
            videoPlayer.pause();
            currentVideoIndex = 0;
        }
    });

    // Keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (videoModal.style.display === 'block') {
            switch(e.key) {
                case 'Escape':
                    videoModal.style.display = 'none';
                    videoPlayer.pause();
                    currentVideoIndex = 0;
                    break;
                case 'ArrowLeft':
                    if (currentVideoIndex > 0) {
                        e.preventDefault();
                        currentVideoIndex--;
                        playCurrentVideoWithoutOverlay();
                    }
                    break;
                case 'ArrowRight':
                    if (currentVideoIndex < videoData.length - 1) {
                        e.preventDefault();
                        currentVideoIndex++;
                        playCurrentVideo();
                    }
                    break;
                case ' ':
                    e.preventDefault();
                    if (videoPlayer.paused) {
                        videoPlayer.play();
                    } else {
                        videoPlayer.pause();
                    }
                    break;
            }
        }
    });
    
    // Enhanced smooth scrolling for arrow links
    const scrollArrows = document.querySelectorAll('.scroll-arrow');
    
    scrollArrows.forEach(arrow => {
        arrow.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Add offset for better positioning
                const offset = 20;
                const targetPosition = targetSection.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Enhanced initial animations with performance optimization
    setTimeout(() => {
        const heroElements = document.querySelectorAll('#hero .fade-in');
        heroElements.forEach((element, index) => {
            // Use requestAnimationFrame for better performance
            requestAnimationFrame(() => {
                setTimeout(() => {
                    element.classList.add('visible');
                }, index * 200);
            });
        });
    }, 500);

    // Cleanup function for better memory management
    function cleanupVideoModal() {
        if (videoPlayer) {
            videoPlayer.pause();
            videoPlayer.src = '';
            videoPlayer.load();
        }
        currentVideoIndex = 0;
        videoOverlay.classList.remove('show');
    }

    // Add cleanup on page unload
    window.addEventListener('beforeunload', cleanupVideoModal);
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

 