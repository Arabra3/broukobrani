class ScrollIndicator {
    constructor() {
        this.thumb = document.querySelector('.scroll-thumb');
        this.track = document.querySelector('.scroll-track');
        
        this.initBounds();
        
        document.addEventListener('parallax-ready', this.initBounds.bind(this));
        this.updatePosition = this.updatePosition.bind(this);
    }
    
    initBounds() {
        const initialScroll = window.innerWidth * 0.21;
        this.minX = 0;
        this.maxX = initialScroll * 2;
        
        this.updatePosition({ detail: { scrollLeft: initialScroll } });
        
        window.addEventListener('scroll-update', this.updatePosition);
    }
    
    updatePosition(event) {
        if (!this.track || !this.thumb) return;
        
        const trackWidth = this.track.offsetWidth;
        if (!trackWidth) return;
        
        const currentX = event.detail.scrollLeft || 0;
        const thumbWidth = this.thumb.offsetWidth;
        
        const scrollPercent = Math.min(1, Math.max(0, currentX / this.maxX));
        
        const availableWidth = trackWidth - thumbWidth;
        
        const position = scrollPercent * availableWidth;
        this.thumb.style.transform = `translate(${position}px, -50%)`;
    }
}

document.addEventListener('parallax-ready', () => {
    window.scrollIndicator = new ScrollIndicator();
});
