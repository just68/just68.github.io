import { Console } from './console/console.js';

const inputElem = document.querySelector('.input-field')
const consoleInstance = new Console(inputElem);

const areYouNewHere = !localStorage.getItem('AreYouNewHere');

if (areYouNewHere) {
    await consoleInstance.executeCommand('typewriter');
} else {
    await consoleInstance.executeCommand('welcome');
}