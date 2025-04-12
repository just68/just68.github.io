const typewriterElem = document.querySelector('.typewriter');
const phraseList = [
    'Hello',
    'I`m just',
    'just68',
    'A web developer',
    'This is my personal space',
    'This is just a website',
];
let phraseIndex = 0;
let letterIndex = 0;
let typingInterval = null;
const letterTypingDelay = 200;
const phraseTypingDelay = 1000;
const letterDeletingDelay = 100;
let isDeleting = false;
let isWaitingForNextPhrase = false;

const typewriter = () => {
    if (!typewriterElem || phraseIndex >= phraseList.length) return;

    const currentPhrase = phraseList[phraseIndex];
    if (!currentPhrase || letterIndex >= currentPhrase.length) return;

    const typewriterLetterElem = document.createElement('span');
    typewriterLetterElem.classList.add('typewriter__letter');
    typewriterElem.appendChild(typewriterLetterElem);
    typewriterLetterElem.innerHTML = currentPhrase[letterIndex];

    letterIndex++;

    if (letterIndex >= currentPhrase.length) {
        stopTyping();
        if (phraseIndex < phraseList.length - 1) {
            isWaitingForNextPhrase = true;
            setTimeout(() => {
                isWaitingForNextPhrase = false;
                startDeleting();
            }, phraseTypingDelay);
        }
    }
}

const startTyping = () => {
    if (typingInterval) return;
    typingInterval = setInterval(typewriter, letterTypingDelay);
    console.log("started typing");
}

const stopTyping = () => {
    if (!typingInterval) return;
    clearInterval(typingInterval);
    typingInterval = null;
    console.log("stopped typing");
}

const deleteLetter = () => {
    if (!typewriterElem) return;

    const letters = typewriterElem.querySelectorAll('.typewriter__letter')

    if (letters.length > 0) {
        typewriterElem.removeChild(letters[letters.length - 1]);
    }

    if (letters.length === 0) {
        stopDeleting();
        if (phraseIndex < phraseList.length - 1) {
            letterIndex = 0;
            phraseIndex++;
            startTyping();
        }
    }
}

const startDeleting = () => {
    if (typingInterval) return;
    isDeleting = true;
    typingInterval = setInterval(deleteLetter, letterDeletingDelay);
}

const stopDeleting = () => {
    if (!typingInterval) return;
    clearInterval(typingInterval);
    typingInterval = null;
    isDeleting = false;
}

let isTypewriterVisible = true;

const startListeningTypewriterScrollPosition = () => {
    if (!typewriterElem) return;

    const handleScroll = () => {
        const rect = typewriterElem.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        const wasVisible = isTypewriterVisible;
        isTypewriterVisible = rect.top < windowHeight && rect.bottom > 0;

        if (!isTypewriterVisible && typingInterval) {
            stopTyping();
            stopDeleting();
        } else if (isTypewriterVisible && !typingInterval) {
            if (isDeleting) {
                startDeleting();
            } else if (isWaitingForNextPhrase) {
                startDeleting();
            } else {
                startTyping();
            }
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
}

startTyping();
startListeningTypewriterScrollPosition();
