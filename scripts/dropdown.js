export const Dropdown = class  {
    constructor(toggle, toggleIndicator, content) {
        this.toggleElem = toggle;
        this.toggleIndicatorElem = toggleIndicator;
        this.contentElem = content;
    }

    addHandler() {
        this.toggleElem.addEventListener('click', () => {
            if (this.contentElem.classList.contains('active')) {
                this.toggleIndicatorElem.classList.remove('active');
                this.contentElem.classList.remove('active');
            } else {
                this.toggleIndicatorElem.classList.add('active');
                this.contentElem.classList.add('active');
            }
        });
    }
}