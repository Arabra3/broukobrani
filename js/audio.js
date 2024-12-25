class AudioManager {
    constructor() {
        console.log('Initializing AudioManager...');
        
        // Inicializace ambientu s .mp3 příponou
        this.ambient = new Audio('assets/sounds/ambient.mp3');
        this.ambient.loop = true;
        this.ambient.volume = 0.4;
        
        // Pole pro zvuky otáčení stránek
        this.pageturns = [
            new Audio('assets/sounds/turnPage1.mp3'),
            new Audio('assets/sounds/turnPage2.mp3'),
            new Audio('assets/sounds/turnPage3.mp3')
        ];
        
        // Pole pro zvuky psaní
        this.writings = [
            new Audio('assets/sounds/writing1.mp3'),
            new Audio('assets/sounds/writing2.mp3'),
            new Audio('assets/sounds/writing3.mp3')
        ];
        
        // Indexy pro sledování, který zvuk je na řadě
        this.currentPageTurnIndex = 0;
        this.currentWritingIndex = 0;
        
        // Zvuky knihy
        this.bookClose = new Audio('assets/sounds/bookClose.mp3');
        this.bookOpen = new Audio('assets/sounds/bookOpen.mp3');
        
        if (!this.ambient) {
            console.error('Ambient audio element not found!');
            return;
        }
        
        // Základní hlasitost
        this.baseVolume = 0.5;
        
        // Nastavení hlasitosti pro všechny zvuky
        this.updateAllVolumes(this.baseVolume);
        
        this.isPlaying = false;
        this.initializeAudio();
        
        // Načítat zvuky až když jsou potřeba
        this.sounds = {};
        this.loadQueue = new Set();
    }

    updateAllVolumes(baseVolume) {
        if (this.ambient) {
            this.ambient.volume = baseVolume * 0.3;  // 30% základní hlasitosti pro ambient
        }
        this.pageturns.forEach(sound => sound.volume = baseVolume * 0.5);
        this.writings.forEach(sound => sound.volume = baseVolume * 0.5);
        this.bookClose.volume = baseVolume * 0.5;
        this.bookOpen.volume = baseVolume * 0.5;
    }

    getVolume() {
        return this.baseVolume;  // Vracíme základní hlasitost
    }

    setVolume(volume) {
        this.baseVolume = volume;  // Uložíme základní hlasitost
        this.updateAllVolumes(volume);
        
        // Vyšleme událost o změně hlasitosti
        window.dispatchEvent(new CustomEvent('volumeChanged', { 
            detail: { volume: this.baseVolume } 
        }));
    }

    initializeAudio() {
        document.addEventListener('click', () => this.tryPlayAudio(), { once: true });
        document.addEventListener('touchstart', () => this.tryPlayAudio(), { once: true });
        console.log('Audio initialized, waiting for user interaction');
    }

    tryPlayAudio() {
        console.log('Trying to play audio...');
        if (!this.isPlaying) {
            this.playAmbient();
        }
    }

    playAmbient() {
        console.log('Starting ambient playback...');
        this.ambient.load();
        this.ambient.onerror = (e) => {
            console.error('Audio error:', e);
        };

        const playPromise = this.ambient.play();
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    this.isPlaying = true;
                    console.log('Ambient sound is now playing');
                })
                .catch(error => {
                    console.error('Error playing ambient sound:', error);
                });
        }
    }

    stopAmbient() {
        console.log('Stopping ambient sound...');
        this.ambient.pause();
        this.isPlaying = false;
    }

    playPageSwitch() {
        this.pageturns[this.currentPageTurnIndex].currentTime = 0;
        this.pageturns[this.currentPageTurnIndex].play()
            .catch(error => console.error('Error playing page turn sound:', error));
        this.currentPageTurnIndex = (this.currentPageTurnIndex + 1) % this.pageturns.length;
    }

    playBookClose() {
        this.bookClose.currentTime = 0;
        this.bookClose.play()
            .catch(error => console.error('Error playing book close sound:', error));
    }

    playBookOpen() {
        this.bookOpen.currentTime = 0;
        this.bookOpen.play()
            .catch(error => console.error('Error playing book open sound:', error));
    }

    playPencilWrite() {
        this.writings[this.currentWritingIndex].currentTime = 0;
        this.writings[this.currentWritingIndex].play()
            .catch(error => console.error('Error playing writing sound:', error));
        this.currentWritingIndex = (this.currentWritingIndex + 1) % this.writings.length;
    }

    preloadSound(key, url) {
        if (!this.loadQueue.has(key)) {
            this.loadQueue.add(key);
            const audio = new Audio();
            audio.src = url;
            audio.preload = 'auto';
            this.sounds[key] = audio;
        }
    }
}

// Vytvoříme instanci pouze pokud ještě neexistuje
if (!window.audioManager) {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM loaded, creating AudioManager...');
        window.audioManager = new AudioManager();
    });
}

window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});

// Volume slider
const volumeSlider = document.getElementById('volumeSlider');
volumeSlider.addEventListener('input', (e) => {
    const value = e.target.value;
    const volume = value * 2.5; // Zvýšíme maximální hlasitost na 250%
    
    ambientSound.volume = volume * 0.4;
    clickSound.volume = volume;
    hoverSound.volume = volume * 0.3;
    
    // Uložení nastavení hlasitosti
    localStorage.setItem('volume', value);
});

// Načtení uloženého nastavení hlasitosti
const savedVolume = localStorage.getItem('volume');
if (savedVolume !== null) {
    volumeSlider.value = savedVolume;
    const volume = savedVolume * 2.5; // Aplikujeme stejný násobitel
    
    ambientSound.volume = volume * 0.4;
    clickSound.volume = volume;
    hoverSound.volume = volume * 0.3;
} 