class LoadingScreen {
    constructor() {
        this.createLoadingScreen();
        this.initializeListeners();
        
        // Přidáme timeout pro případ, že by se něco zaseklo
        this.timeout = setTimeout(() => {
            console.log('Loading screen timeout - forcing hide');
            this.hide();
        }, 5000); // 5 sekund maximum
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
        // Počkáme na načtení všech obrázků
        Promise.all([
            ...Array.from(document.images).map(img => {
                if (img.complete) return Promise.resolve();
                return new Promise(resolve => {
                    img.addEventListener('load', resolve);
                    img.addEventListener('error', resolve);
                });
            }),
            new Promise(resolve => {
                if (this.title.complete) resolve();
                else this.title.addEventListener('load', resolve);
            })
        ])
        .then(() => this.checkComponents())
        .catch(error => {
            console.error('Loading error:', error);
            this.hide();
        });
    }

    checkComponents() {
        let attempts = 0;
        const maxAttempts = 50; // 5 sekund při 100ms intervalu

        return new Promise((resolve) => {
            const check = () => {
                attempts++;
                
                // Logujeme stav komponent
                console.log('Checking components:', {
                    audioManager: !!window.audioManager,
                    diary: !!window.diary,
                    insectSystem: !!window.insectSystem,
                    attempt: attempts
                });

                if (window.audioManager && window.diary && window.insectSystem) {
                    clearTimeout(this.timeout);
                    resolve();
                } else if (attempts >= maxAttempts) {
                    console.warn('Component check timed out - proceeding anyway');
                    clearTimeout(this.timeout);
                    resolve();
                } else {
                    setTimeout(check, 100);
                }
            };
            
            check();
        }).then(() => this.hide());
    }

    hide() {
        // Zabráníme vícenásobnému volání
        if (this.isHiding) return;
        this.isHiding = true;

        console.log('Hiding loading screen');
        this.screen.classList.add('hidden');
        
        setTimeout(() => {
            this.screen.remove();
            console.log('Loading screen removed');
        }, 500);
    }
}

// Vytvoříme instanci až po načtení DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('Creating LoadingScreen instance');
    window.loadingScreen = new LoadingScreen();
}); 