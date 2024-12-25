class ScrollIndicator {
    constructor() {
        this.thumb = document.querySelector('.scroll-thumb');
        this.track = document.querySelector('.scroll-track');
        
        // Reference na parallax bounds
        this.minX = window.parallaxInstance?.bounds.minX || 0;
        this.maxX = window.parallaxInstance?.bounds.maxX || 0;
        
        this.updatePosition = this.updatePosition.bind(this);
        this.init();
    }
    
    init() {
        // Nastavení šířky thumb podle poměru viewport/celková šířka
        const viewportWidth = window.innerWidth;
        const totalWidth = this.maxX - this.minX;
        const thumbWidthPercent = (viewportWidth / totalWidth) * 100;
        this.thumb.style.width = `${Math.min(100, thumbWidthPercent)}%`;
        
        // Přidání event listeneru pro aktualizaci pozice
        window.addEventListener('scroll-update', this.updatePosition);
    }
    
    updatePosition(event) {
        const currentX = event.detail.x || 0;
        const totalWidth = this.maxX - this.minX;
        
        // Výpočet pozice v procentech
        const position = ((currentX - this.minX) / totalWidth) * 100;
        
        // Aktualizace pozice thumbu
        this.thumb.style.transform = `translateX(${position}%)`;
    }
}

// Inicializace po načtení parallax systému
document.addEventListener('parallax-ready', () => {
    window.scrollIndicator = new ScrollIndicator();
});
