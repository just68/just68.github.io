import { canvasOptions, createUI, dropdownCanvasOptions } from './canvas-options-contol.js';
import { Game } from './canvas-animation.js';

createUI();
const game = new Game(document.querySelector('.canvas'), canvasOptions);

window.onload = () => {
    dropdownCanvasOptions.addHandler();
    game.start();
};