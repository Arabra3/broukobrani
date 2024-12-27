class LoadingScreen {
    constructor() {
        const existingScreen = document.querySelector('.loading-screen');
        if (existingScreen) {
            this.screen = existingScreen;
        } else {
            this.createLoadingScreen();
        }
        
        this.initializeListeners();
        
        this.timeout = setTimeout(() => {
            console.log('Loading screen timeout - forcing hide');
            this.hide();
        }, 20000);
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
        const diary = document.getElementById('diary');
        if (diary) {
            diary.classList.remove('hidden');
            diary.style.visibility = 'visible';
        }

        // Počkáme na načtení všech obrázků v deníku
        const diaryImages = Array.from(diary.getElementsByTagName('img'));
        
        // Přidáme parallax obrázky
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
        ].map(src => {
            const img = new Image();
            img.src = src;
            return img;
        });

        // Spojíme všechny obrázky do jednoho pole
        const allImages = [...diaryImages, ...parallaxImages];
        
        // Funkce pro kontrolu, zda je obrázek načtený
        const isImageLoaded = img => {
            if (!img.complete) return false;
            if (img.naturalWidth === 0) return false;
            return true;
        };

        // Funkce pro kontrolu všech obrázků
        const areAllImagesLoaded = () => {
            return allImages.every(img => isImageLoaded(img));
        };

        // Funkce pro kontrolu načtení
        const checkImages = () => {
            if (areAllImagesLoaded()) {
                console.log('Všechny obrázky jsou načtené');
                setTimeout(() => {
                    this.hide();
                }, 500);
            } else {
                console.log('Čekám na načtení obrázků...');
                setTimeout(checkImages, 100);
            }
        };

        // Spustíme kontrolu
        checkImages();
    }

    hide() {
        if (this.isHiding) return;
        this.isHiding = true;

        setTimeout(() => {
            document.body.classList.add('loaded');
            
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
                        });
                    }
                }, 1000);
            });
        }, 100);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Creating LoadingScreen instance');
    window.loadingScreen = new LoadingScreen();
}); 