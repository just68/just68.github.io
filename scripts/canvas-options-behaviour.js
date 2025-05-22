import { MovableContainer } from './movable-container.js';
import { Dropdown } from './dropdown.js';
import { CanvasSettings } from './canvas-settings.js';

const elements = {
    canvasOptions: document.querySelector('.canvas-options'),
    dropdownToggle: document.querySelector('.canvas-options__dropdown-toggle'),
    dropdownArrow: document.querySelector('.canvas-options__dropdown-arrow'),
    dropdownMenu: document.querySelector('.canvas-options__dropdown-menu'),
    menuContent: document.querySelector('.canvas-options__dropdown-menu-content'),
    page: document.querySelector('.page')
};

const canvasSettings = new CanvasSettings();

const createOptionElement = (title) => {
    const optionElem = document.createElement('div');
    optionElem.className = 'canvas-options__option';
    optionElem.innerHTML = `<p class="canvas-options__option-title">${title}</p>`;
    return optionElem;
};

const createCountControl = (className, value) => {
    return `
        <div class="canvas-options__count-control">
            <img src="assets/icons/decrease-24.svg" alt="Decrease" class="canvas-options__increase-decrease-icon canvas-options__icon--${className}-decrease">
            <p class="canvas-options__${className}-text">${value}</p>
            <img src="assets/icons/increase-24.svg" alt="Increase" class="canvas-options__increase-decrease-icon canvas-options__icon--${className}-increase">
        </div>
    `;
};

const createRadioControl = (className, altShow, altHide) => {
    return `
        <img src="assets/icons/radio-button-checked-24.svg" alt="${altShow}" class="canvas-options__icon canvas-options__icon--show-${className}">
        <img src="assets/icons/radio-button-unchecked-24.svg" alt="${altHide}" class="canvas-options__icon canvas-options__icon--hide-${className}">
    `;
};

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
};

const createAnimationControl = () => {
    const optionElem = createOptionElement('Start/Stop');
    optionElem.innerHTML += `
        <img src="assets/icons/play-circle-24.svg" alt="Play" class="canvas-options__icon canvas-options__icon--start">
        <img src="assets/icons/pause-circle-24.svg" alt="Pause" class="canvas-options__icon canvas-options__icon--stop">
    `;
    elements.menuContent.appendChild(optionElem);

    const startIcon = optionElem.querySelector('.canvas-options__icon--start');
    const stopIcon = optionElem.querySelector('.canvas-options__icon--stop');

    const updateIcons = () => {
        const isPlaying = canvasSettings.getSetting('fps') !== 0;
        startIcon.classList.toggle('hidden', isPlaying);
        stopIcon.classList.toggle('hidden', !isPlaying);
    };
    updateIcons();

    startIcon.addEventListener('click', () => {
        canvasSettings.updateSetting('fps', canvasSettings.getDefaultSetting('fps'));
        updateIcons();
    });
    stopIcon.addEventListener('click', () => {
        canvasSettings.updateSetting('fps', 0);
        updateIcons();
    });
};

const createSnakeCountControl = () => {
    const optionElem = createOptionElement('Snake count');
    optionElem.innerHTML += createCountControl('snake-count', canvasSettings.getSetting('snakeCount'));
    elements.menuContent.appendChild(optionElem);

    const decreaseBtn = optionElem.querySelector('.canvas-options__icon--snake-count-decrease');
    const increaseBtn = optionElem.querySelector('.canvas-options__icon--snake-count-increase');
    const countText = optionElem.querySelector('.canvas-options__snake-count-text');

    const updateCount = (delta) => {
        const newCount = canvasSettings.getSetting('snakeCount') + delta;
        if (newCount >= 0 && newCount <= 50) {
            canvasSettings.updateSetting('snakeCount', newCount);
            countText.textContent = newCount;
        }
    };

    decreaseBtn.addEventListener('click', () => updateCount(-1));
    increaseBtn.addEventListener('click', () => updateCount(1));
};

const createFPSControl = () => {
    const optionElem = createOptionElement('FPS');
    optionElem.innerHTML += createCountControl('fps-count', canvasSettings.getSetting('fps'));
    elements.menuContent.appendChild(optionElem);

    const decreaseBtn = optionElem.querySelector('.canvas-options__icon--fps-count-decrease');
    const increaseBtn = optionElem.querySelector('.canvas-options__icon--fps-count-increase');
    const countText = optionElem.querySelector('.canvas-options__fps-count-text');

    const updateCount = (delta) => {
        const newCount = canvasSettings.getSetting('fps') + delta;
        if (newCount >= 0 && newCount <= 120) {
            canvasSettings.updateSetting('fps', newCount);
            countText.textContent = newCount;
        }
    };

    decreaseBtn.addEventListener('click', () => updateCount(-1));
    increaseBtn.addEventListener('click', () => updateCount(1));
};

const createPageVisibilityControl = () => {
    const optionElem = createOptionElement('Hide page');
    optionElem.innerHTML += createRadioControl('page', 'Show page', 'Hide page');
    elements.menuContent.appendChild(optionElem);

    const showIcon = optionElem.querySelector('.canvas-options__icon--show-page');
    const hideIcon = optionElem.querySelector('.canvas-options__icon--hide-page');

    const updateVisibility = () => {
        const isHidden = canvasSettings.getSetting('isPageHidden');
        elements.page.style.display = isHidden ? 'none' : 'initial';
        toggleRadioIcons(showIcon, hideIcon, isHidden);
    };
    updateVisibility();

    showIcon.addEventListener('click', () => {
        canvasSettings.updateSetting('isPageHidden', false);
        updateVisibility();
    });
    hideIcon.addEventListener('click', () => {
        canvasSettings.updateSetting('isPageHidden', true);
        updateVisibility();
    });
};

const createDebugVisibilityControl = () => {
    const optionElem = createOptionElement('Show debug');
    optionElem.innerHTML += createRadioControl('debug', 'Show debug', 'Hide debug');
    elements.menuContent.appendChild(optionElem);

    const showIcon = optionElem.querySelector('.canvas-options__icon--show-debug');
    const hideIcon = optionElem.querySelector('.canvas-options__icon--hide-debug');

    const updateVisibility = () => {
        const isDebug = canvasSettings.getSetting('isDebugMode');
        console.log(isDebug)
        toggleRadioIcons(showIcon, hideIcon, isDebug);
    };

    updateVisibility();

    showIcon.addEventListener('click', () => {
        canvasSettings.updateSetting('isDebugMode', false);
        updateVisibility();
    });

    hideIcon.addEventListener('click', () => {
        canvasSettings.updateSetting('isDebugMode', true);
        updateVisibility();
    });
};

const createResetControl = () => {
    const optionElem = createOptionElement('Reset');
    optionElem.innerHTML += `<img src="assets/icons/reset-24.svg" alt="Reset" class="canvas-options__reset-icon">`;
    elements.menuContent.appendChild(optionElem);

    const resetBtn = optionElem.querySelector('.canvas-options__reset-icon');
    resetBtn.addEventListener('click', () => {
        canvasSettings.resetSettings();
        elements.menuContent.innerHTML = '';
        createSettingsUI();
    });
};

const createSettingsUI = () => {
    elements.menuContent.innerHTML = '';
    createAnimationControl();
    createSnakeCountControl();
    createFPSControl();
    createPageVisibilityControl();
    createDebugVisibilityControl();
    createResetControl();
};
createSettingsUI();

const movableCanvasOptionsContainer = new MovableContainer(elements.canvasOptions, elements.dropdownToggle);
movableCanvasOptionsContainer.makeItMovable();

const dropdownCanvasOptions = new Dropdown(
    elements.dropdownToggle,
    elements.dropdownArrow,
    elements.dropdownMenu
);
dropdownCanvasOptions.addHandler();

export { canvasSettings };