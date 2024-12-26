class LoadingScreen {
    constructor() {
        this.createLoadingScreen();
        this.initializeListeners();
        
        this.timeout = setTimeout(() => {
            console.log('Loading screen timeout - forcing hide');
            this.hide();
        }, 8000);
    }

    createLoadingScreen() {
        this.screen = document.createElement('div');
        this.screen.className = 'loading-screen';
        
        this.content = document.createElement('div');
        this.content.className = 'loading-content';
        
        this.title = document.createElement('img');
        this.title.src = 'assets/ui/title.png';
        this.title.className = 'loading-title';
        this.title.alt = 'Title';
        
        this.content.appendChild(this.title);
        this.screen.appendChild(this.content);
        document.body.appendChild(this.screen);
    }

    initializeListeners() {
        const parallaxImages = [
            'assets/parallax/layer1.png',
            'assets/parallax/layer2.png',
            'assets/parallax/layer3.png',
            'assets/parallax/layer4.png',
            'assets/parallax/layer5.png',
            'assets/parallax/layer6.png',
            'assets/parallax/layer7.jpg',
            'assets/parallax/layer1-shadow.png',
            'assets/parallax/layer2-shadow.png',
            'assets/parallax/layer3-shadow.png',
            'assets/parallax/layer4-shadow.png',
            'assets/parallax/layer5-shadow.png',
            'assets/parallax/layer6-shadow.png'
        ];

        let loadedImages = 0;
        const totalImages = parallaxImages.length;

        Promise.all([
            ...parallaxImages.map(src => {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.onload = () => {
                        loadedImages++;
                        console.log(`Loaded: ${src} (${loadedImages}/${totalImages})`);
                        if (loadedImages === totalImages) {
                            console.log('All parallax images loaded');
                            setTimeout(() => {
                                this.hide();
                            }, 500);
                        }
                        resolve();
                    };
                    img.onerror = () => {
                        console.warn(`Failed to load parallax image: ${src}`);
                        loadedImages++;
                        resolve();
                    };
                    img.src = src;
                });
            }),
            new Promise(resolve => {
                if (this.title.complete) resolve();
                else this.title.addEventListener('load', resolve);
            })
        ])
        .catch(error => {
            console.error('Loading error:', error);
            this.hide();
        });
    }

    hide() {
        if (this.isHiding) return;
        this.isHiding = true;

        console.log('Hiding loading screen');
        
        // Nejdřív zobrazíme obsah stránky
        document.body.classList.add('loaded');
        
        // Pak teprve skryjeme loading screen
        requestAnimationFrame(() => {
            this.screen.classList.add('hidden');
            
            if (this.timeout) {
                clearTimeout(this.timeout);
            }
            
            setTimeout(() => {
                this.screen.remove();
                console.log('Loading screen removed');
                
                if (window.audioManager) {
                    console.log('Starting ambient audio...');
                    window.audioManager.ambient?.play().catch(error => {
                        console.warn('Could not autoplay ambient:', error);
                        document.addEventListener('click', () => {
                            window.audioManager.ambient?.play();
                        }, { once: true });
                    });
                }
            }, 500);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Creating LoadingScreen instance');
    window.loadingScreen = new LoadingScreen();
}); 