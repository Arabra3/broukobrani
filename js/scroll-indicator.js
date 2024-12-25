class ScrollIndicator {
    constructor() {
        this.thumb = document.querySelector('.scroll-thumb');
        this.track = document.querySelector('.scroll-track');
        
        document.addEventListener('parallax-ready', this.initBounds.bind(this));
        this.updatePosition = this.updatePosition.bind(this);
    }
    
    initBounds() {
        const maxScroll = window.innerWidth * 0.42;
        this.minX = 0;
        this.maxX = maxScroll;
        
        window.addEventListener('scroll-update', this.updatePosition);
    }
    
    updatePosition(event) {
        const currentX = event.detail.scrollLeft || 0;
        const totalWidth = this.maxX - this.minX;
        const trackWidth = this.track.offsetWidth;
        const thumbWidth = this.thumb.offsetWidth;
        
        // Vypočítáme maximální posun (šířka tracku mínus šířka thumbu)
        const maxTranslate = trackWidth - thumbWidth;
        
        // Vypočítáme pozici v pixelech
        const position = (currentX / totalWidth) * maxTranslate;
        
        // Aplikujeme transformaci na thumb
        this.thumb.style.transform = `translateX(${position}px)`;
    }
}

// Inicializace po načtení parallax systému
document.addEventListener('parallax-ready', () => {
    window.scrollIndicator = new ScrollIndicator();
});
