export class Console {
    constructor(inputElem) {
        this.inputElem = inputElem;
        this.inputHandler = null;
        this.enterKeyHandler = null;
        this.backspaceKeyHandler = null;
    }

    async executeCommand(command) {
        this.inputElem.disabled = true;

        try {
            const response = await fetch(`/scripts/console/commands/${command}.js`);

            const commandCode = await response.text();
            const executeCommand = new Function('inputElem', `
                ${commandCode}
                return command(inputElem);
            `);

            await executeCommand(this.inputElem);
        } catch (error) {
            this.inputElem.value = 'wrong command';
        } finally {
            this.inputElem.disabled = false;
            this.inputElem.focus();
            
            if (this.inputElem.value === '') {
                this.addEnterKeydownListener();
            } else {
                this.addBackspaceKeydownHandler();
            }
        }
    }

    addInputHandler() {
        if (this.inputHandler) {
            this.inputElem.removeEventListener('input', this.inputHandler);
        }

        const originalText = this.inputElem.value;
        
        this.inputHandler = () => {
            if (this.inputElem.value.length > originalText.length) {
                this.inputElem.value = '';
                this.inputElem.removeEventListener('input', this.inputHandler);
                this.addEnterKeydownListener();
            }
        };
        this.inputElem.addEventListener('input', this.inputHandler);
    }

    addEnterKeydownListener() {
        if (this.enterKeyHandler) {
            this.inputElem.removeEventListener('keydown', this.enterKeyHandler);
        }

        this.enterKeyHandler = async (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                const command = this.inputElem.value;
                this.inputElem.value = '';
                await this.executeCommand(command);
            }
        };

        this.inputElem.addEventListener('keydown', this.enterKeyHandler);
    }

    addBackspaceKeydownHandler() {
        if (this.backspaceKeyHandler) {
            this.inputElem.removeEventListener('keydown', this.backspaceKeyHandler);
        }
        
        this.addInputHandler();

        this.backspaceKeyHandler = async (event) => {
            if (event.key === 'Backspace') {
                event.preventDefault();
                this.inputElem.value = '';
                this.inputElem.removeEventListener('input', this.inputHandler);
                this.addEnterKeydownListener();
            }

            this.inputElem.removeEventListener('keydown', this.backspaceKeyHandler);
            this.backspaceKeyHandler = null;
        };

        this.inputElem.addEventListener('keydown', this.backspaceKeyHandler);
    }
}