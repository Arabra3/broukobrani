document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.parallax-container');
    const layers = document.querySelectorAll('.parallax-layer');
    const shadows = document.querySelectorAll('.parallax-shadow');
    
    // Vypneme pointer-events pro všechny assety
    function disablePointerEvents() {
        console.log('Disabling pointer events for all assets...');
        
        // Vypneme pro všechny parallax vrstvy
        layers.forEach(layer => {
            layer.style.pointerEvents = 'none';
            
            // Vypneme pro všechny obrázky ve vrstvě
            layer.querySelectorAll('img').forEach(img => {
                img.style.pointerEvents = 'none';
            });
            
            // Vypneme pro všechny SVG elementy
            layer.querySelectorAll('svg').forEach(svg => {
                svg.style.pointerEvents = 'none';
            });
            
            // Vypneme pro všechny div elementy kromě těch s brouky
            layer.querySelectorAll('div:not(.insect-button)').forEach(div => {
                div.style.pointerEvents = 'none';
            });
        });
        
        // Vypneme pro všechny stíny
        shadows.forEach(shadow => {
            shadow.style.pointerEvents = 'none';
        });
        
        // Vypneme pro všechny pozadí
        document.querySelectorAll('.background-layer').forEach(bg => {
            bg.style.pointerEvents = 'none';
        });
        
        // Vypneme pro všechny dekorativní elementy
        document.querySelectorAll('.decoration').forEach(dec => {
            dec.style.pointerEvents = 'none';
        });
        
        console.log('Pointer events disabled for all assets');
    }
    
    // Zavoláme funkci pro vypnutí pointer-events
    disablePointerEvents();
    
    // Ponecháme pouze wheel události pro scrollování
    container.addEventListener('wheel', handleWheel, { passive: false });
    
    // Nastavíme výchozí cursor
    container.style.cursor = 'default';
    
    // Nastavíme počáteční pozici na polovinu maximálního scrollu
    const initialScroll = window.innerWidth * 0.21;
    let scrollLeft = initialScroll;
    let currentVelocity = 0;
    let scrollVelocity = 0;
    let isAutoScrolling = false;
    
    // Vylepšená easing funkce pro plynulejší začátek a konec
    function easeInOutCubic(t) {
        return t < 0.5 
            ? 4 * t * t * t 
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    
    function updatePosition(deltaY, smooth = true) {
        const scrollSpeed = 15;
        const maxScroll = window.innerWidth * 0.42;
        const edgeThreshold = window.innerWidth * 0.03;
        const hardStopThreshold = edgeThreshold * 0.3;
        const microMovementThreshold = 0.01; // Práh pro mikropohyby
        
        // Kontrola mikropohybů na okrajích
        if ((scrollLeft <= 0 && deltaY < 0) || (scrollLeft >= maxScroll && deltaY > 0)) {
            scrollVelocity = 0;
            return true;
        }
        
        if (smooth) {
            if (Math.sign(scrollVelocity) !== Math.sign(deltaY)) {
                scrollVelocity = deltaY * 0.3;
            } else {
                scrollVelocity = scrollVelocity * 0.8 + deltaY * 0.2;
            }
        } else {
            scrollVelocity = deltaY;
        }
        
        // Výpočet vzdálenosti od okrajů
        const distanceFromStart = scrollLeft;
        const distanceFromEnd = maxScroll - scrollLeft;
        
        // Zpomalení pouze při přibližování k okraji s velmi agresivním zastavením
        let slowdownFactor = 1;
        if (distanceFromStart < edgeThreshold && scrollVelocity < 0) {
            if (distanceFromStart < hardStopThreshold || Math.abs(scrollVelocity) < microMovementThreshold) {
                slowdownFactor = 0;
                scrollVelocity = 0;
                return true;
            } else {
                slowdownFactor = Math.pow((distanceFromStart - hardStopThreshold) / (edgeThreshold - hardStopThreshold), 2);
            }
        } else if (distanceFromEnd < edgeThreshold && scrollVelocity > 0) {
            if (distanceFromEnd < hardStopThreshold || Math.abs(scrollVelocity) < microMovementThreshold) {
                slowdownFactor = 0;
                scrollVelocity = 0;
                return true;
            } else {
                slowdownFactor = Math.pow((distanceFromEnd - hardStopThreshold) / (edgeThreshold - hardStopThreshold), 2);
            }
        }
        
        // Aplikace zpomalení s kontrolou mikropohybů
        const adjustedDelta = (scrollVelocity * scrollSpeed / 100) * slowdownFactor;
        if (Math.abs(adjustedDelta) < microMovementThreshold) {
            return true;
        }
        
        // Striktní limity pro scrollLeft s okamžitým zastavením
        const newScrollLeft = scrollLeft + adjustedDelta;
        if (newScrollLeft <= 0) {
            scrollLeft = 0;
            scrollVelocity = 0;
            return true;
        } else if (newScrollLeft >= maxScroll) {
            scrollLeft = maxScroll;
            scrollVelocity = 0;
            return true;
        } else {
            scrollLeft = newScrollLeft;
        }
        
        container.scrollLeft = scrollLeft;
        
        layers.forEach((layer, index) => {
            const speed = index * 0.1; //speed je zavisla na indexu vrstvy
            const offset = scrollLeft * speed; 
            layer.style.transform = `translateX(-${offset}px)`;
            
            if (shadows[index]) {
                shadows[index].style.transform = `translateX(-${offset}px)`;
            }
        });
        
        return false;
    }
    
    function handleWheel(e) {
        e.preventDefault();
        
        const direction = Math.sign(e.deltaY);
        const speed = Math.min(Math.abs(e.deltaY), 152);
        const normalizedDelta = direction * speed;
        
        const targetVelocity = Math.sign(normalizedDelta) * Math.min(Math.abs(normalizedDelta * 0.805), 121);
        
        scrollVelocity = scrollVelocity * 0.915 + targetVelocity * 0.085;
        
        if (!isAutoScrolling) {
            isAutoScrolling = true;
            autoScroll();
        }
    }
    
    function autoScroll() {
        if (!isAutoScrolling) return;
        
        if (Math.abs(scrollVelocity) > 0.1) {
            const isAtEdge = updatePosition(scrollVelocity);
            
            if (isAtEdge) {
                // Okamžité zastavení na okraji
                scrollVelocity = 0;
                isAutoScrolling = false;
            } else {
                scrollVelocity *= 0.97;
                requestAnimationFrame(autoScroll);
            }
        } else {
            scrollVelocity = 0;
            isAutoScrolling = false;
        }
    }
    
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowRight':
                updatePosition(70);
                break;
            case 'ArrowLeft':
                updatePosition(-70);
                break;
        }
    });
    
    // Ponechat pouze wheel event listener
    container.addEventListener('wheel', handleWheel, { passive: false });
    
    // Event listenery pro reset scrollu
    window.addEventListener('beforeunload', function() {
        if (container) {
            container.scrollLeft = 0;
            scrollLeft = 0;
        }
        window.scrollTo(0, 0);
    });
    
    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            if (container) {
                const initialScroll = window.innerWidth * 0.21;
                container.scrollLeft = initialScroll;
                scrollLeft = initialScroll;
                scrollVelocity = 0;
                
                // Nastavíme počáteční pozice vrstev a stínů
                layers.forEach((layer, index) => {
                    const speed = index * 0.1;
                    const offset = initialScroll * speed;
                    layer.style.transform = `translateX(-${offset}px)`;
                    
                    if (shadows[index]) {
                        shadows[index].style.transform = `translateX(-${offset}px)`;
                    }
                });
            }
        }
    });
    
    // Přidáme listener pro reload
    window.addEventListener('load', function() {
        if (container) {
            const initialScroll = window.innerWidth * 0.21;
            container.scrollLeft = initialScroll;
            scrollLeft = initialScroll;
            scrollVelocity = 0;
            
            // Nastavíme počáteční pozice vrstev a stínů
            layers.forEach((layer, index) => {
                const speed = index * 0.1;
                const offset = initialScroll * speed;
                layer.style.transform = `translateX(-${offset}px)`;
                
                if (shadows[index]) {
                    shadows[index].style.transform = `translateX(-${offset}px)`;
                }
            });
        }
    });
    
    // Přidejte tento kód do vašeho parallax skriptu
    function updateInsectPositions(scrollX, scrollY) {
        const insects = document.querySelectorAll('.insect-button');
        insects.forEach(insect => {
            const layer = parseInt(insect.style.transform.match(/translateZ\((\d+(?:\.\d+)?)/)[1] * 10);
            const xOffset = scrollX * layer;
            const yOffset = scrollY * layer;
            
            const baseX = parseFloat(insect.style.left);
            const baseY = parseFloat(insect.style.top);
            
            insect.style.transform = `translate(${xOffset}px, ${yOffset}px) translateZ(${layer/10}px)`;
        });
    }
    
    // Volejte updateInsectPositions při každé aktualizaci parallaxu
    
    // Přidat throttling pro wheel event
    function throttle(func, limit) {
        let inThrottle;
        return function(e) {
            if (!inThrottle) {
                func(e);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
    
    // Použít requestAnimationFrame pro smooth scrolling
    let ticking = false;
    container.addEventListener('wheel', (e) => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleWheel(e);
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
    
    // Optimalizovat transform pomocí translate3d
    layers.forEach((layer, index) => {
        const speed = index * 0.1;
        const offset = scrollLeft * speed;
        layer.style.transform = `translate3d(-${offset}px, 0, 0)`;
    });
});

