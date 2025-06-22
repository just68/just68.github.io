import { Dropdown } from './dropdown.js';
import { CanvasOptions } from './canvas-options.js';

const elements = {
    dropdownToggle: document.querySelector('.canvas-options__dropdown-toggle'),
    dropdownArrow: document.querySelector('.canvas-options__dropdown-arrow'),
    dropdownMenu: document.querySelector('.canvas-options__dropdown-menu'),
    dropdownMenuContent: document.querySelector('.canvas-options__dropdown-menu-content'),
    page: document.querySelector('.page')
}

const canvasOptions = new CanvasOptions();

const createOptionElement = (title) => {
    const optionElem = document.createElement('div');
    optionElem.className = 'canvas-options__option';
    optionElem.innerHTML = `<p class="canvas-options__option-title">${title}</p>`;
    return optionElem;
}

const createCountControl = (className, value) => {
    return `
        <div class="canvas-options__count-control">
            <img src="assets/icons/decrease-24.svg" alt="Decrease" class="canvas-options__increase-decrease-icon canvas-options__icon--${className}-decrease">
            <p class="canvas-options__${className}-text">${value}</p>
            <img src="assets/icons/increase-24.svg" alt="Increase" class="canvas-options__increase-decrease-icon canvas-options__icon--${className}-increase">
        </div>
    `;
}

const createRadioControl = (className, altShow, altHide) => {
    return `
        <img src="assets/icons/radio-button-checked-24.svg" alt="${altShow}" class="canvas-options__icon canvas-options__icon--show-${className}">
        <img src="assets/icons/radio-button-unchecked-24.svg" alt="${altHide}" class="canvas-options__icon canvas-options__icon--hide-${className}">
    `;
}

const toggleRadioIcons = (showIcon, hideIcon, isActive) => {
    if (showIcon.classList.contains('hidden')) {
        showIcon.classList.remove('hidden');
        hideIcon.classList.add('hidden');
    } else if (hideIcon.classList.contains('hidden')) {
        showIcon.classList.add('hidden');
        hideIcon.classList.remove('hidden');
    } else {
        if (isActive) {
            hideIcon.classList.add('hidden');
        } else {
            showIcon.classList.add('hidden');
        }
    }
}

const createAnimationControl = () => {
    const optionElem = createOptionElement('Start/Stop');
    optionElem.innerHTML += `
        <img src="assets/icons/play-circle-24.svg" alt="Play" class="canvas-options__icon canvas-options__icon--start">
        <img src="assets/icons/pause-circle-24.svg" alt="Pause" class="canvas-options__icon canvas-options__icon--stop">
    `;
    elements.dropdownMenuContent.appendChild(optionElem);

    const startIcon = optionElem.querySelector('.canvas-options__icon--start');
    const stopIcon = optionElem.querySelector('.canvas-options__icon--stop');

    const updateIcons = () => {
        const isPlaying = canvasOptions.get('fps') !== 0;
        startIcon.classList.toggle('hidden', isPlaying);
        stopIcon.classList.toggle('hidden', !isPlaying);
    }
    updateIcons();

    startIcon.addEventListener('click', () => {
        canvasOptions.update('fps', canvasOptions.get('lastFps'));
        updateIcons();
        updateUI();
    });
    stopIcon.addEventListener('click', () => {
        canvasOptions.update('lastFps', canvasOptions.get('fps'));
        canvasOptions.update('fps', 0);
        updateIcons();
        updateUI();
    });
}

const createSnakeCountControl = () => {
    const optionElem = createOptionElement('Snake count');
    optionElem.innerHTML += createCountControl('snake-count', canvasOptions.get('snakeCount'));
    elements.dropdownMenuContent.appendChild(optionElem);

    const decreaseBtn = optionElem.querySelector('.canvas-options__icon--snake-count-decrease');
    const increaseBtn = optionElem.querySelector('.canvas-options__icon--snake-count-increase');
    const countText = optionElem.querySelector('.canvas-options__snake-count-text');
    countText.classList.add('canvas-options__count-text');

    const updateCount = (delta) => {
        const newCount = canvasOptions.get('snakeCount') + delta;
        if (newCount >= 0 && newCount <= 50) {
            canvasOptions.update('snakeCount', newCount);
            countText.textContent = newCount;
        }
    }

    decreaseBtn.addEventListener('click', () => updateCount(-1));
    increaseBtn.addEventListener('click', () => updateCount(1));
}

const createFPSControl = () => {
    const optionElem = createOptionElement('FPS (speed)');
    optionElem.innerHTML += createCountControl('fps-count', canvasOptions.get('fps'));
    elements.dropdownMenuContent.appendChild(optionElem);

    const decreaseBtn = optionElem.querySelector('.canvas-options__icon--fps-count-decrease');
    const increaseBtn = optionElem.querySelector('.canvas-options__icon--fps-count-increase');
    const countText = optionElem.querySelector('.canvas-options__fps-count-text');
    countText.classList.add('canvas-options__count-text');

    const updateCount = (delta) => {
        const newCount = canvasOptions.get('fps') + delta;
        if (newCount >= 0 && newCount <= 120) {
            canvasOptions.update('fps', newCount);
            countText.textContent = newCount;
        }
        updateUI();
    }

    decreaseBtn.addEventListener('click', () => updateCount(-1));
    increaseBtn.addEventListener('click', () => updateCount(1));
}

const createPageVisibilityControl = () => {
    const optionElem = createOptionElement('Hide page');
    optionElem.innerHTML += createRadioControl('page', 'Show page', 'Hide page');
    elements.dropdownMenuContent.appendChild(optionElem);

    const showIcon = optionElem.querySelector('.canvas-options__icon--show-page');
    const hideIcon = optionElem.querySelector('.canvas-options__icon--hide-page');

    const updateVisibility = () => {
        const isHidden = canvasOptions.get('isPageHidden');
        if (isHidden) {
            elements.page.classList.add('hidden');
        } else {
            elements.page.classList.remove('hidden');
        }
        toggleRadioIcons(showIcon, hideIcon, isHidden);
    }
    updateVisibility();

    showIcon.addEventListener('click', () => {
        canvasOptions.update('isPageHidden', false);
        updateVisibility();
    });
    hideIcon.addEventListener('click', () => {
        canvasOptions.update('isPageHidden', true);
        updateVisibility();
    });
}

const createDebugVisibilityControl = () => {
    const optionElem = createOptionElement('Show debug');
    optionElem.innerHTML += createRadioControl('debug', 'Show debug', 'Hide debug');
    elements.dropdownMenuContent.appendChild(optionElem);

    const showIcon = optionElem.querySelector('.canvas-options__icon--show-debug');
    const hideIcon = optionElem.querySelector('.canvas-options__icon--hide-debug');

    const updateVisibility = () => {
        const isDebug = canvasOptions.get('isDebugMode');
        toggleRadioIcons(showIcon, hideIcon, isDebug);
    };

    updateVisibility();

    showIcon.addEventListener('click', () => {
        canvasOptions.update('isDebugMode', false);
        updateVisibility();
    });

    hideIcon.addEventListener('click', () => {
        canvasOptions.update('isDebugMode', true);
        updateVisibility();
    });
}

const createResetControl = () => {
    const optionElem = createOptionElement('Reset');
    optionElem.innerHTML += `<img src="assets/icons/reset-24.svg" alt="Reset" class="canvas-options__reset-icon">`;
    elements.dropdownMenuContent.appendChild(optionElem);

    const resetBtn = optionElem.querySelector('.canvas-options__reset-icon');
    resetBtn.addEventListener('click', () => {
        localStorage.setItem('SavedCanvasData', JSON.stringify({}));
        canvasOptions.reset();
        updateUI();
    });
}

const createUI = () => {
    elements.dropdownMenuContent.innerHTML = '';
    createAnimationControl();
    createSnakeCountControl();
    createFPSControl();
    createPageVisibilityControl();
    createDebugVisibilityControl();
    createResetControl();
}

const updateUI = () => {
    elements.dropdownMenuContent.innerHTML = '';
    createUI();
}

const dropdownCanvasOptions = new Dropdown(
    elements.dropdownToggle,
    elements.dropdownArrow,
    elements.dropdownMenu,
    elements.dropdownMenuContent
);

export { canvasOptions, createUI, dropdownCanvasOptions }