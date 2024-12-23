class Diary {
    constructor() {
        console.log('Initializing diary...');
        this.diary = document.getElementById('diary');
        this.diaryIcon = document.querySelector('.diary-icon');
        this.diaryContent = document.querySelector('.diary-content');
        
        this.lastFoundInsect = null;
        
        if (!this.diary) {
            console.error('Diary element not found!');
            return;
        }
        
        this.diaryPages = document.querySelectorAll('.diary-page');
        this.currentPage = 1;
        this.currentBackground = 1;
        this.totalBackgrounds = 3;
        
        this.prevButton = document.querySelector('.diary-nav.prev');
        this.nextButton = document.querySelector('.diary-nav.next');
        
        this.initializeListeners();
        this.initializeVolumeControl();
        
        // Automaticky otevřeme deník při načtení
        this.openDiary();
    }
    
    openDiary() {
        this.diary.classList.remove('hidden');
        window.audioManager?.playBookOpen();
        
        // Ujistíme se, že jsme na první stránce
        this.showPage(1);
    }
    
    initializeListeners() {
        console.log('Setting up diary listeners...');
        
        this.diaryIcon.addEventListener('click', () => {
            console.log('Diary icon clicked');
            this.toggleDiary();
        });
        
        if (this.prevButton) {
            this.prevButton.addEventListener('click', () => {
                window.audioManager?.playPageSwitch();
                this.changePage(-1);
            });
        }
        
        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => {
                window.audioManager?.playPageSwitch();
                this.changePage(1);
            });
        }
        
        const closeButton = document.querySelector('.diary-close');
        if (!closeButton) {
            console.error('Close button not found!');
        } else {
            closeButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleDiary();
            });
        }
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.diary.classList.contains('hidden')) {
                e.preventDefault();
                this.toggleDiary();
            }
        });
    }
    
    toggleDiary() {
        console.log('Toggling diary visibility');
        if (!this.diary.classList.contains('hidden')) {
            window.audioManager?.playBookClose();
            setTimeout(() => {
                this.diary.classList.add('hidden');
            }, 100);
        } else {
            window.audioManager?.playBookOpen();
            this.diary.classList.remove('hidden');
            
            if (this.lastFoundInsect) {
                const pageNumber = parseInt(document.querySelector(`.diary-page[data-insect="${this.lastFoundInsect}"]`)?.getAttribute('data-page'));
                if (pageNumber) {
                    this.goToPage(pageNumber);
                    this.lastFoundInsect = null;
                }
            }
            
            this.updateNavigationButtons();
        }
    }
    
    setLastFoundInsect(insectId) {
        this.lastFoundInsect = insectId;
    }
    
    goToPage(pageNumber) {
        const currentActivePage = document.querySelector('.diary-page.active');
        if (currentActivePage) {
            currentActivePage.classList.remove('active');
        }
        
        const nextActivePage = document.querySelector(`.diary-page[data-page="${pageNumber}"]`);
        if (nextActivePage) {
            nextActivePage.classList.add('active');
            this.currentPage = pageNumber;
            this.changeBackground();
            this.updateNavigationButtons();
        }
    }
    
    changePage(direction) {
        const nextPage = this.currentPage + direction;
        
        if (nextPage < 1 || nextPage > 10) {
            console.log('Page change cancelled - out of bounds');
            return;
        }
        
        const currentActivePage = document.querySelector('.diary-page.active');
        if (currentActivePage) {
            currentActivePage.classList.remove('active');
            console.log('Removing active from page:', currentActivePage.getAttribute('data-page'));
        }
        
        const nextActivePage = document.querySelector(`.diary-page[data-page="${nextPage}"]`);
        if (nextActivePage) {
            nextActivePage.classList.add('active');
            this.currentPage = nextPage;
            console.log('Setting active to page:', nextPage);
            this.changeBackground();
            this.updateNavigationButtons();
        } else {
            console.error('Next page not found:', nextPage);
            return;
        }
    }
    
    changeBackground() {
        this.currentBackground = (this.currentBackground % this.totalBackgrounds) + 1;
        this.diaryContent.style.backgroundImage = `url('assets/ui/denik${this.currentBackground}.png')`;
        console.log('Změněno pozadí na:', this.currentBackground);
    }
    
    updateNavigationButtons() {
        if (this.prevButton) {
            this.prevButton.style.display = this.currentPage <= 1 ? 'none' : 'block';
        }
        
        if (this.nextButton) {
            this.nextButton.style.display = this.currentPage >= 10 ? 'none' : 'block';
        }
    }
    
    initializeVolumeControl() {
        const volumeSlider = document.getElementById('volumeSlider');
        if (volumeSlider) {
            // Nastavíme počáteční hodnotu z AudioManageru
            volumeSlider.value = (window.audioManager?.getVolume() || 0.5) * 100;
            
            volumeSlider.addEventListener('input', (e) => {
                const volume = e.target.value / 100;
                if (window.audioManager) {
                    window.audioManager.setVolume(volume);
                }
            });
    
            // Posloucháme změny hlasitosti z AudioManageru
            window.addEventListener('volumeChanged', (e) => {
                volumeSlider.value = e.detail.volume * 100;
            });
        }
    }
}

function discoverInsect(insectId) {
    const page = document.querySelector(`.diary-page[data-insect="${insectId}"]`);
    if (page) {
        page.classList.remove('undiscovered');
        updateFoundCount();
    }
}

function updateFoundCount() {
    const foundCount = document.querySelectorAll('.diary-page:not(.undiscovered)').length - 1;
    document.getElementById('found-count').textContent = foundCount;
}

let diaryInstance;

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, creating diary...');
    diaryInstance = new Diary();
    window.diary = diaryInstance;
});
