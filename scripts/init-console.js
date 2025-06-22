import { Console } from './console/console.js';

const inputElem = document.querySelector('.input-field')
const console = new Console(inputElem);
const areYouNewHere = !localStorage.getItem('AreYouNewHere');

if (areYouNewHere) {
    localStorage.setItem('PlaceholderState', 'wow');
    await console.executeCommand('typewriter');
} else {
    localStorage.setItem('PlaceholderState', 'default');
    await console.executeCommand('welcome');
}

await console.executeCommand('placeholder');