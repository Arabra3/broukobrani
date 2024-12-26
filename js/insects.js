console.log('Insects.js se načítá...');

class InsectSystem {
    constructor() {
        console.log('InsectSystem initialized');
        
        this.createInsectContainer();
        
        this.insects = [
            { 
                id: 'insect1', 
                name: 'Křižák červený',
                image: 'assets/insects/insect1clean.png',
                hoverImage: 'assets/insects/insect1.png',
                found: false, 
                layer: 50,  // grass-layer
                position: { x: 48, y: 35 }
            },
            { 
                id: 'insect2', 
                name: 'Nosatec',
                image: 'assets/insects/insect2clean.png',
                hoverImage: 'assets/insects/insect2.png',
                found: false, 
                layer: 30,   // bushes-layer
                position: { x: 27, y: 25 }
            },
            { 
                id: 'insect3', 
                name: 'Křižák banánový',
                image: 'assets/insects/insect3clean.png',
                hoverImage: 'assets/insects/insect3.png',
                found: false, 
                layer: 70,
                position: { x: 15, y: 30 }
            },
            { 
                id: 'insect4', 
                name: 'Stonožka',
                image: 'assets/insects/insect4clean.png',
                hoverImage: 'assets/insects/insect4.png',
                found: false, 
                layer: 110,  // top-layer (nejvyšší vrstva)
                position: { x: 10, y: 65}
            },
            { 
                id: 'insect5', 
                name: 'Motýl zelený',
                image: 'assets/insects/insect5clean.png',
                hoverImage: 'assets/insects/insect5.png',
                found: false, 
                layer: 70,
                position: { x: 32, y: 44 }
            },
            { 
                id: 'insect6', 
                name: 'Šváb obecný',
                image: 'assets/insects/insect6clean.png',
                hoverImage: 'assets/insects/insect6.png',
                found: false, 
                layer: 90,
                position: { x: 42, y: 28 }
            },
            { 
                id: 'insect7', 
                name: 'Nosorožík',
                image: 'assets/insects/insect7clean.png',
                hoverImage: 'assets/insects/insect7.png',
                found: false, 
                layer: 130,
                position: { x: 37, y: 70 }
            },
            { 
                id: 'insect8', 
                name: 'Motýl červený',
                image: 'assets/insects/insect8clean.png',
                hoverImage: 'assets/insects/insect8.png',
                found: false, 
                layer: 110,
                position: { x: 60, y: 55}
            },
            { 
                id: 'insect9', 
                name: 'Nový brouk',
                image: 'assets/insects/insect9clean.png',
                hoverImage: 'assets/insects/insect9.png',
                found: false, 
                layer: 70,  // Můžete upravit vrstvu podle potřeby
                position: { x: 57, y: 10 }  // Můžete upravit pozici podle potřeby
            }
        ];
        
        this.initializeInsects();
        this.diary = document.querySelector('.diary-content');
        
        // Vyšleme událost o dokončení inicializace
        window.dispatchEvent(new Event('insectSystemReady'));
    }
    
    createInsectContainer() {
        const container = document.createElement('div');
        container.className = 'insects-container';
        document.body.appendChild(container);
        this.insectContainer = container;
    }
    
    initializeInsects() {
        console.log('Initializing insects...');
        
        // Aktualizované mapování vrstev podle parallax.css
        const layerMap = {
            140: 7,  // top-layer
            130: 6,  // front-layer
            110: 5,  // grass-layer
            90: 4,   // bushes-layer
            70: 3,   // trees-middle-layer
            50: 2,   // trees-back-layer
            30: 1,   // mountains-layer
            10: 0    // sky-layer
        };

        this.insects.forEach(insect => {
            const button = document.createElement('button');
            button.className = 'insect-button';
            button.id = insect.id;
            
            // Vytvoříme a nastavíme obrázek s lazy loadingem
            const img = document.createElement('img');
            img.loading = 'lazy';
            img.src = insect.image;
            img.alt = insect.name;
            button.appendChild(img);
            
            // Přidáme hover efekty
            button.addEventListener('mouseenter', () => {
                // Načíst hover obrázek až při prvním hover
                if (!button._hoverLoaded) {
                    const hoverImg = new Image();
                    hoverImg.src = insect.hoverImage;
                    button._hoverLoaded = true;
                }
                img.src = insect.hoverImage;
            });
            
            button.addEventListener('mouseleave', () => {
                img.src = insect.image;
            });
            
            // Použijeme nové mapování vrstev
            const layerIndex = layerMap[insect.layer];
            const layer = document.querySelectorAll('.parallax-layer')[layerIndex];
            
            if (layer) {
                Object.assign(button.style, {
                    position: 'absolute',
                    left: `${(insect.position.x / 100) * 3840}px`,
                    top: `${(insect.position.y / 100) * 1080}px`,
                    pointerEvents: 'all',
                    zIndex: insect.layer,
                    background: 'none',
                    border: 'none',
                    padding: '0',
                    cursor: 'pointer'
                });
                
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.collectInsect(insect, button);
                });
                
                layer.appendChild(button);
                console.log(`Successfully added insect ${insect.id} to visual layer ${insect.layer}`);
            } else {
                console.error(`Failed to add insect ${insect.id}: Visual layer ${insect.layer} not found`);
            }
        });
    }
    
    collectInsect(insect, button) {
        console.log('Attempting to collect insect:', insect.id);
        
        if (insect.found) {
            console.log('Insect already found');
            return;
        }
        
        console.log('Collecting insect:', insect.id);
        insect.found = true;
        
        // Přehrajeme zvuk psaní
        window.audioManager?.playPencilWrite();
        
        // Spustíme animaci deníku
        const diaryIcon = document.querySelector('.diary-icon');
        if (diaryIcon) {
            // Odstraníme existující třídu pro případ, že animace ještě běží
            diaryIcon.classList.remove('pulse');
            // Vynucené překreslení
            void diaryIcon.offsetWidth;
            // Přidáme třídu znovu pro spuštění nové animace
            diaryIcon.classList.add('pulse');
            
            // Odstraníme třídu až po dokončení animace (1s)
            setTimeout(() => {
                diaryIcon.classList.remove('pulse');
            }, 1000);
        }
        
        button.style.transform = 'translate3d(0,0,0) scale(0)';
        button.style.willChange = 'transform, opacity';
        
        setTimeout(() => {
            button.remove();
            console.log(`Insect ${insect.id} removed from DOM`);
        }, 500);

        this.updateDiary(insect.id);
        
        // Nastavíme poslední nalezený hmyz v deníku
        window.diary?.setLastFoundInsect(insect.id);
        
        // Vyvolání události
        const event = new CustomEvent('insectCollected', {
            detail: { insectId: insect.id }
        });
        window.dispatchEvent(event);
    }

    updateDiary(insectId) {
        console.log('Updating diary for:', insectId);
        const diaryPage = document.querySelector(`.diary-page[data-insect="${insectId}"]`);
        if (diaryPage) {
            diaryPage.classList.remove('undiscovered');
            
            const foundCount = document.querySelectorAll('.diary-page:not(.undiscovered)').length - 1;
            const foundCountElement = document.getElementById('found-count');
            if (foundCountElement) {
                foundCountElement.textContent = foundCount;
            }
        } else {
            console.error('Diary page not found for:', insectId);
        }
    }

    playCollectSound() {
        try {
            const collectSound = new Audio('assets/sounds/collect.mp3');
            collectSound.play().catch(err => console.log('Zvuk nelze přehrát:', err));
        } catch (err) {
            console.log('Zvuk nelze přehrát:', err);
        }
    }
}

// Přidáme globální error handler pro zachycení všech chyb
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});

console.log('Creating new InsectSystem instance...');
const insectSystem = new InsectSystem();

// Sem přidejte nový testovací kód
setTimeout(() => {
    console.log('Checking for insect elements...');
    const wrappers = document.querySelectorAll('.insect-wrapper');
    const buttons = document.querySelectorAll('.insect-button');
    
    console.log('Found insect wrappers:', wrappers.length);
    console.log('Found insect buttons:', buttons.length);
    
    wrappers.forEach(wrapper => {
        console.log('Wrapper:', {
            id: wrapper.getAttribute('data-insect-id'),
            pointerEvents: window.getComputedStyle(wrapper).pointerEvents,
            zIndex: window.getComputedStyle(wrapper).zIndex
        });
    });
}, 1000);
