class LoadingScreen {
    constructor() {
        this.createLoadingScreen();
        this.initializeListeners();
    }

    createLoadingScreen() {
        // Vytvoření elementů
        this.screen = document.createElement('div');
        this.screen.className = 'loading-screen';
        
        this.content = document.createElement('div');
        this.content.className = 'loading-content';
        
        this.title = document.createElement('img');
        this.title.src = 'assets/ui/title.png';
        this.title.className = 'loading-title';
        this.title.alt = 'Title';
        
        // Sestavení struktury
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
            // Počkáme na načtení title obrázku
            new Promise(resolve => {
                if (this.title.complete) resolve();
                else this.title.addEventListener('load', resolve);
            })
        ])
        .then(() => this.waitForComponents())
        .then(() => this.hide());
    }

    waitForComponents() {
        return new Promise(resolve => {
            const checkComponents = () => {
                if (window.audioManager && window.diary && window.insectSystem) {
                    resolve();
                } else {
                    requestAnimationFrame(checkComponents);
                }
            };
            checkComponents();
        });
    }

    hide() {
        // Přidáme malé zpoždění pro jistotu
        setTimeout(() => {
            this.screen.classList.add('hidden');
            // Odstraníme loading screen po dokončení animace
            setTimeout(() => {
                this.screen.remove();
            }, 500);
        }, 500);
    }
} 