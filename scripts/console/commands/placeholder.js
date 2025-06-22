const command = async (inputElem) => {
    const placeholderState = localStorage.getItem('PlaceholderState');

    switch (placeholderState) {
        case 'wow':
            inputElem.placeholder = 'Wow, what is it!?';
            break;
        case 'firstCommand':
            inputElem.placeholder = 'Should i can write some command here...';
            break;
        case 'default':
            inputElem.placeholder = 'Enter a command';
            break;
        default:
            break;
    }
}