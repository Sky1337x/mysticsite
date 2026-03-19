// Navigation Toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const YOUTUBE_CHANNEL_ID = 'UCBTafI6VGfch543DRjGeC0w';
const YOUTUBE_MAX_RESULTS = 6;

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // Animate hamburger icon
        const spans = navToggle.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768 && navMenu && navToggle) {
            navMenu.classList.remove('active');
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions)
    : null;

// Observe all cards and sections
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.support-card, .social-card, .video-card, .stat-card');
    animatedElements.forEach(el => {
        if (observer) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease-out';
            observer.observe(el);
        } else {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }
    });

    initAutoVideos();
    initChannelMetrics();
});

function formatCompactNumber(value) {
    const number = Number(value || 0);
    return number.toLocaleString(undefined, {
        notation: 'compact',
        maximumFractionDigits: 1
    });
}

async function fetchChannelMetrics() {
    const endpoint = new URL('/api/youtube-channel-metrics', window.location.origin);
    endpoint.searchParams.set('channelId', YOUTUBE_CHANNEL_ID);

    const response = await fetch(endpoint.toString());
    if (!response.ok) {
        throw new Error('YouTube channel metrics request failed.');
    }

    const data = await response.json();
    if (data.error) {
        throw new Error(data.error || 'YouTube metrics API error.');
    }

    if (!data.statistics) {
        throw new Error('No channel statistics were returned.');
    }

    return data.statistics;
}

async function initChannelMetrics() {
    const subscriberCountEl = document.getElementById('subscriberCount');
    const videoCountEl = document.getElementById('videoCount');
    const viewCountEl = document.getElementById('viewCount');

    if (!subscriberCountEl || !videoCountEl || !viewCountEl) {
        return;
    }

    try {
        const stats = await fetchChannelMetrics();

        const subscriberCount = Number(stats.subscriberCount || 0);
        const videoCount = Number(stats.videoCount || 0);
        const viewCount = Number(stats.viewCount || 0);

        subscriberCountEl.textContent = formatCompactNumber(subscriberCount);
        videoCountEl.textContent = formatCompactNumber(videoCount);
        viewCountEl.textContent = formatCompactNumber(viewCount);

        subscriberCountEl.title = `${subscriberCount.toLocaleString()} subscribers`;
        videoCountEl.title = `${videoCount.toLocaleString()} videos`;
        viewCountEl.title = `${viewCount.toLocaleString()} total views`;
    } catch (error) {
        console.error(error);
    }
}

function createVideoCard(video) {
    const card = document.createElement('div');
    card.className = 'video-card';

    const link = document.createElement('a');
    link.href = `https://www.youtube.com/watch?v=${video.videoId}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';

    const thumb = document.createElement('img');
    thumb.src = video.thumbnail;
    thumb.alt = video.title;
    thumb.className = 'video-thumbnail';

    const info = document.createElement('div');
    info.className = 'video-info';

    const title = document.createElement('h3');
    title.className = 'video-title';
    title.textContent = video.title;

    const meta = document.createElement('p');
    meta.className = 'video-meta';
    meta.textContent = video.meta;

    link.appendChild(thumb);
    info.appendChild(title);
    info.appendChild(meta);
    card.appendChild(link);
    card.appendChild(info);

    return card;
}

function getUploadsPlaylistId(channelId) {
    if (!channelId || !channelId.startsWith('UC') || channelId.length < 3) {
        return null;
    }
    return `UU${channelId.slice(2)}`;
}

async function fetchLatestVideos() {
    const endpoint = new URL('/api/youtube-latest-videos', window.location.origin);
    endpoint.searchParams.set('channelId', YOUTUBE_CHANNEL_ID);
    endpoint.searchParams.set('maxResults', String(YOUTUBE_MAX_RESULTS));

    const response = await fetch(endpoint.toString());
    if (!response.ok) {
        throw new Error('YouTube API request failed.');
    }

    const data = await response.json();
    if (data.error) {
        throw new Error(data.error || 'YouTube API error.');
    }

    const videos = Array.isArray(data.videos) ? data.videos : [];
    return videos.filter((video) => video.videoId && video.thumbnail);
}

async function initAutoVideos() {
    const videosGrid = document.getElementById('videosGrid');
    const videosStatus = document.getElementById('videosStatus');

    if (!videosGrid) {
        return;
    }

    try {
        const videos = await fetchLatestVideos();

        videosGrid.innerHTML = '';
        videos.forEach((video) => {
            videosGrid.appendChild(createVideoCard(video));
        });

        if (videosStatus) {
            videosStatus.textContent = videos.length
                ? 'Latest videos loaded automatically from YouTube.'
                : 'No videos found yet.';
        }
    } catch (error) {
        if (videosStatus) {
            videosStatus.textContent = 'Could not load videos automatically right now. Please try again later.';
        }
        console.error(error);
    }
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') {
            return;
        }
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Google Form submission handler
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    const showSubmissionPopup = () => {
        const existingPopup = document.querySelector('.submit-popup-overlay');
        if (existingPopup) {
            existingPopup.remove();
        }

        const overlay = document.createElement('div');
        overlay.className = 'submit-popup-overlay';

        const popup = document.createElement('div');
        popup.className = 'submit-popup';
        popup.innerHTML = `
            <div class="submit-popup-icon">✓</div>
            <h3>Message Sent</h3>
            <p>Thanks for reaching out. I will get back to you soon.</p>
            <button type="button" class="submit-popup-close">Awesome</button>
        `;

        overlay.appendChild(popup);
        document.body.appendChild(overlay);
        document.body.classList.add('popup-open');

        const closePopup = () => {
            overlay.classList.add('hide');
            setTimeout(() => {
                overlay.remove();
                document.body.classList.remove('popup-open');
            }, 250);
        };

        const closeButton = popup.querySelector('.submit-popup-close');
        if (closeButton) {
            closeButton.addEventListener('click', closePopup);
        }

        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                closePopup();
            }
        });

        const onEscape = (event) => {
            if (event.key === 'Escape') {
                closePopup();
                document.removeEventListener('keydown', onEscape);
            }
        };
        document.addEventListener('keydown', onEscape);

        setTimeout(() => {
            if (document.body.contains(overlay)) {
                closePopup();
            }
        }, 4000);
    };

    contactForm.addEventListener('submit', (e) => {
        showSubmissionPopup();

        setTimeout(() => {
            contactForm.reset();
        }, 500);
    });
}

// Add active class to current page nav link
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
    }
});

// Navbar background on scroll
const navbar = document.querySelector('.navbar');

if (navbar) {
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
        }
    });
}
