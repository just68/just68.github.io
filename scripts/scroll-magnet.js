const sectionElems = document.querySelectorAll('.section');
const footerElem = document.querySelector('.footer');
const scrollItTextElem = document.querySelector('.scroll-indicator');
const animationDuration = 300;
const delayBeforeAnimation = 400;
let isScrolling = false;
let scrollTimeout;

const findMostVisibleSection = () => {
    let mostVisibleSection = null;
    let maxVisibleHeight = 0;

    sectionElems.forEach(sectionElem => {
        const sectionRect = sectionElem.getBoundingClientRect();
        const sectionHeight = sectionRect.height;
        const viewportHeight = window.innerHeight;

        // Skip sections that are taller than viewport
        if (sectionHeight > viewportHeight) {
            return;
        }

        const visibleHeight = Math.min(sectionRect.bottom, viewportHeight) - Math.max(sectionRect.top, 0);

        if (visibleHeight > maxVisibleHeight) {
            maxVisibleHeight = visibleHeight;
            mostVisibleSection = sectionElem;
        }
    });

    return mostVisibleSection;
};

const scrollToSection = (section) => {
    isScrolling = true;
    window.scrollTo({
        top: section.offsetTop,
        behavior: 'smooth'
    });

    setTimeout(() => {
        isScrolling = false;
    }, animationDuration);
};

window.addEventListener('scroll', () => {
    if (isScrolling) return;

    // for .scroll-indicator
    if (window.scrollY > 0) {
        scrollItTextElem.style.opacity = '0';
    } else {
        scrollItTextElem.style.opacity = '1';
    }

    clearTimeout(scrollTimeout);

    scrollTimeout = setTimeout(() => {
        const footerRect = footerElem.getBoundingClientRect();
        const isFooterVisible = footerRect.top < window.innerHeight && footerRect.bottom > 0;

        if (!isFooterVisible) {
            const mostVisibleSection = findMostVisibleSection();
            if (mostVisibleSection) {
                scrollToSection(mostVisibleSection);
            }
        }
    }, delayBeforeAnimation);
});