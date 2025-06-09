const command = async (inputElem) => {
    inputElem.value = 'Look at the bottom';

    const footerTextElem = document.querySelector('.page__footer-text');
    footerTextElem.innerHTML = '<a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">CLICK ME</a>'
    
}