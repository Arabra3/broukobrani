class ScrollIndicator {
    constructor() {
        this.thumb = document.querySelector('.scroll-thumb');
        this.track = document.querySelector('.scroll-track');
        
        this.initBounds();
        
        document.addEventListener('parallax-ready', this.initBounds.bind(this));
        this.updatePosition = this.updatePosition.bind(this);
        
        const initialScroll = window.innerWidth * 0.21;
        this.updatePosition({ detail: { scrollLeft: initialScroll } });
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
        
        // Vypočítáme procentuální pozici scrollu (0-1)
        const scrollPercent = currentX / totalWidth;
        
        // Vypočítáme maximální pozici thumbu (šířka tracku mínus šířka thumbu)
        const maxPosition = trackWidth - thumbWidth;
        
        // Vypočítáme finální pozici
        const position = scrollPercent * maxPosition;
        
        // Aplikujeme transformaci
        this.thumb.style.transform = `translateX(${position}px)`;
    }
}

// Inicializace po načtení parallax systému
document.addEventListener('parallax-ready', () => {
    window.scrollIndicator = new ScrollIndicator();
});
