export const Dropdown = class  {
    constructor(toggle, toggleIndicator, content, contentInner) {
        this.isOpen = localStorage.getItem('IsDropdownOpen') === 'true';
        this.toggleElem = toggle;
        this.toggleIndicatorElem = toggleIndicator;
        this.contentElem = content;
        this.contentInnerElem = contentInner;
        this.contentInnerElemHeight = this.contentInnerElem.offsetHeight;
    }

    toggle() {
        this.contentInnerElemHeight = this.contentInnerElem.offsetHeight;

        if (this.isOpen) {
            this.toggleIndicatorElem.classList.add('active');
            this.contentElem.style.height = this.contentInnerElemHeight + 'px';
        } else {
            this.toggleIndicatorElem.classList.remove('active');
            this.contentElem.style.height = '0';
        }
    }

    addHandler() {
        this.toggle();
        
        this.toggleElem.addEventListener('click', () => {
            this.isOpen = !this.isOpen;
            this.toggle();
            localStorage.setItem('IsDropdownOpen', this.isOpen);
        });
    }
}