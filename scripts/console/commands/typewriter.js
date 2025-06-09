const command = async (inputElem) => {
    const phrases = [
        'Hello',
        'I`m morukek',
        'A web developer',
        'This is my personal space',
        'This is just a website',
    ];

    const letterTypingDelay = 200;
    const phraseTypingDelay = 2000;
    const letterDeletingDelay = 100;

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const typePhrase = async (phrase) => {
        for (let i = 0; i < phrase.length; i++) {
            inputElem.value += phrase[i];
            await sleep(letterTypingDelay);
        }
    }

    const deletePhrase = async () => {
        while (inputElem.value.length > 0) {
            inputElem.value = inputElem.value.slice(0, -1);
            await sleep(letterDeletingDelay);
        }
    }

    for (let i = 0; i < phrases.length; i++) {
        await typePhrase(phrases[i]);
        if (i < phrases.length - 1) {
            await sleep(phraseTypingDelay);
            await deletePhrase();
        }
    }

    localStorage.setItem('AreYouNewHere', 'false');
};