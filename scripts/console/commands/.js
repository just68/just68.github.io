const command = async (inputElem) => {
    inputElem.value = 'Look at the bottom';

    const footerTextElem = document.querySelector('.page__footer-text');
    footerTextElem.innerHTML = '<a href="javascript:void(0)">CLICK ME</a>';

    footerTextElem.addEventListener('click', async (e) => {
        e.preventDefault();

        const iframe = document.createElement('iframe');
        iframe.src = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&mute=0&enablejsapi=1&loop=1&playlist=dQw4w9WgXcQ';
        iframe.style.position = 'fixed';
        iframe.style.zIndex = '99999';
        iframe.style.top = '0';
        iframe.style.left = '0';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        iframe.id = 'youtube-player';
        document.body.appendChild(iframe);

        let player; // YouTube Player API
        window.onYouTubeIframeAPIReady = () => {
            player = new YT.Player('youtube-player', {
                events: {
                    'onStateChange': (event) => {
                        if (event.data === YT.PlayerState.PAUSED) {
                            player.playVideo();
                        }
                        if (event.data === YT.PlayerState.ENDED) {
                            player.playVideo();
                        }
                    }
                }
            });
        };

        // Load YouTube API
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        try {
            await iframe.requestFullscreen();
        } catch (err) {
            console.error(err);
        }
    });
}