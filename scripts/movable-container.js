export const MovableContainer = class {
    static #lastId = 0;
    static #generateId() {
        return `${++MovableContainer.#lastId}`;
    }

    constructor(elem, elemDragContainer) {
        this.id = MovableContainer.#generateId();
        this.elem = elem;
        this.elemDragContainer = elemDragContainer;
        this.startLeft = 0;
        this.startTop = 0;
        this.startX = 0;
        this.startY = 0;

        this.elem.style.position = "absolute";
        this.elem.style.zIndex = "9999";
        this.restorePosition();
    }

    savePosition() {
        const config = {
            id: this.id,
            position: {
                top: this.elem.style.top || '0px',
                left: this.elem.style.left || '0px'
            }
        };
        localStorage.setItem('movableContainerPositionById' + this.id, JSON.stringify(config));
    }

    restorePosition() {
        const savedConfig = localStorage.getItem('movableContainerPositionById' + this.id);
        if (savedConfig) {
            try {
                const config = JSON.parse(savedConfig);
                if (config.position && config.position.top && config.position.left) {
                    this.elem.style.top = config.position.top;
                    this.elem.style.left = config.position.left;
                }
            } catch (e) {
                console.error('Error restoring position:', e);
            }
        }
    }

    moveToDefaultPosition() {
        this.elem.style.top = '0px';
        this.elem.style.left = '0px';
        localStorage.removeItem('movableContainerPositionById' + this.id);
    }

    makeItMovable() {
        this.onMouseDown = (e) => {
            e.preventDefault();
            this.startX = e.clientX;
            this.startY = e.clientY;

            document.addEventListener("mousemove", this.onMouseMove);
            document.addEventListener("mouseup", this.onMouseUp);
        };

        this.onMouseMove = (e) => {
            e.preventDefault();
            this.startLeft = this.startX - e.clientX;
            this.startTop = this.startY - e.clientY;
            this.startX = e.clientX;
            this.startY = e.clientY;

            // Calculate new position
            const newTop = this.elem.offsetTop - this.startTop;
            const newLeft = this.elem.offsetLeft - this.startLeft;

            // Get element dimensions
            const elemWidth = this.elem.offsetWidth;
            const elemHeight = this.elem.offsetHeight;

            // Check boundaries
            const maxLeft = window.innerWidth - elemWidth;
            const maxTop = window.innerHeight - elemHeight;

            let positionChanged = false;

            // Update position only if within bounds
            if (newLeft >= 0 && newLeft <= maxLeft) {
                this.elem.style.left = `${newLeft}px`;
                positionChanged = true;
            }
            if (newTop >= 0 && newTop <= maxTop) {
                this.elem.style.top = `${newTop}px`;
                positionChanged = true;
            }

            // Save position if it changed
            if (positionChanged) {
                this.savePosition();
            }
        };

        this.onMouseUp = () => {
            document.removeEventListener("mousemove", this.onMouseMove);
            document.removeEventListener("mouseup", this.onMouseUp);
        };

        this.elemDragContainer.addEventListener("mousedown", this.onMouseDown);
    }
}