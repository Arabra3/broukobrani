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
        const speed = Math.min(Math.abs(e.deltaY), 64);
        const normalizedDelta = direction * speed;
        
        const targetVelocity = Math.sign(normalizedDelta) * 
            Math.min(Math.abs(normalizedDelta * 0.805), 80);
        
        scrollVelocity = scrollVelocity * 0.915 + targetVelocity * 0.085;
        
        if (!isAutoScrolling) {
            isAutoScrolling = true;
            requestAnimationFrame(autoScroll);
        }
    }
    
    function autoScroll() {
        if (!isAutoScrolling) return;
        
        if (Math.abs(scrollVelocity) > 0.1) {
            const isAtEdge = updatePosition(scrollVelocity);
            
            if (isAtEdge) {
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
    
    let keyPressed = false;
    let currentDirection = 0;

    document.addEventListener('keydown', (e) => {
        // Přidáme podporu pro A/D i šipky
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || 
            e.key === 'd' || e.key === 'a' ||
            e.key === 'D' || e.key === 'A') { // Podpora i pro velká písmena
            
            e.preventDefault();
            keyPressed = true;
            
            // Určení směru pro všechny podporované klávesy
            const newDirection = (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') ? 1 : -1;
            
            if (newDirection !== currentDirection) {
                scrollVelocity = newDirection * 6;
            }
            
            currentDirection = newDirection;
            
            if (!isAutoScrolling) {
                isAutoScrolling = true;
                requestAnimationFrame(smoothScroll);
            }
        }
    });

    document.addEventListener('keyup', (e) => {
        // Přidáme podporu pro A/D i šipky
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || 
            e.key === 'd' || e.key === 'a' ||
            e.key === 'D' || e.key === 'A') {
            
            // Kontrola pro všechny podporované klávesy
            if ((e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') && currentDirection === 1 ||
                (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') && currentDirection === -1) {
                keyPressed = false;
                currentDirection = 0;
            }
        }
    });

    let isDragging = false;
    let startX = 0;
    let lastX = 0;
    let dragVelocity = 0;
    let lastDragTime = 0;
    let holdDirection = 0;

    document.addEventListener('mousedown', (e) => {
        if (e.button === 1) { // Pouze middle click
            e.preventDefault();
            isDragging = true;
            startX = e.clientX;
            lastX = e.clientX;
            lastDragTime = performance.now();
            holdDirection = 0;
            container.style.cursor = 'grabbing';
        }
    });

    // Původní mousemove handler zůstává beze změny
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const currentTime = performance.now();
        const timeDelta = Math.max(currentTime - lastDragTime, 16);
        const dragDelta = lastX - e.clientX;
        
        const distanceFromStart = e.clientX - startX;
        const absoluteDistance = Math.abs(distanceFromStart);
        
        const normalizedDistance = absoluteDistance / 440;
        const baseMultiplier = Math.min(normalizedDistance * 2.3, 2.7);
        const smoothStep = x => x * x * (3 - 2 * x);
        const progressiveMultiplier = smoothStep(Math.min(baseMultiplier / 3, 1)) * 2.7;
        
        const velocityFactor = Math.min(Math.abs(dragDelta) / timeDelta / 2.2, 1);
        const smoothedMultiplier = progressiveMultiplier * 
            (1 - Math.exp(-normalizedDistance * 1.4)) * 
            (1 + velocityFactor * 0.27);
        
        if (absoluteDistance > 15) {
            holdDirection = Math.sign(distanceFromStart) * -1;
        }
        
        if (timeDelta > 0) {
            const baseVelocity = (dragDelta / timeDelta) * 5.4;
            const velocitySmoothing = Math.max(0.65, 1 - velocityFactor * 0.27);
            const distanceAdjustedVelocity = baseVelocity * (1 + smoothedMultiplier);
            dragVelocity = dragVelocity * velocitySmoothing + 
                          distanceAdjustedVelocity * (1 - velocitySmoothing);
        }
        
        if (holdDirection !== 0) {
            const minHoldSpeed = 4.5 + (smoothedMultiplier * 2.7);
            if (Math.abs(dragVelocity) < minHoldSpeed) {
                dragVelocity = holdDirection * minHoldSpeed;
            }
        }
        
        const maxDragSpeed = 25.2 * (1 + smoothedMultiplier * 0.32);
        const currentSpeed = Math.abs(dragVelocity);
        if (currentSpeed > maxDragSpeed) {
            const limitFactor = 1 + Math.min((currentSpeed - maxDragSpeed) / 11, 1);
            dragVelocity = Math.sign(dragVelocity) * maxDragSpeed / limitFactor;
        }
        
        if (!isAutoScrolling) {
            isAutoScrolling = true;
            requestAnimationFrame(smoothScroll);
        }
        
        scrollVelocity = dragVelocity;
        
        lastX = e.clientX;
        lastDragTime = currentTime;
    });

    // Sjednocený mouseup handler
    document.addEventListener('mouseup', (e) => {
        if (e.button === 0 || e.button === 1) {
            if (isDragging) {
                isDragging = false;
                holdDirection = 0;
                container.style.cursor = 'default';
                
                if (Math.abs(dragVelocity) > 0.1) {
                    // Snížená setrvačnost o ~15%
                    const finalVelocityMultiplier = Math.min(Math.abs(dragVelocity) / 34, 1.1); // Sníženo z 1.3
                    scrollVelocity = dragVelocity * (0.93 + finalVelocityMultiplier * 0.13); // Sníženo z 0.95 a 0.15
                    
                    if (!isAutoScrolling) {
                        isAutoScrolling = true;
                        requestAnimationFrame(smoothScroll);
                    }
                }
            }
        }
    });

    function smoothScroll() {
        if (!isAutoScrolling) return;
        
        if (isDragging) {
            if (holdDirection !== 0) {
                const holdSpeed = Math.max(Math.abs(scrollVelocity), 4.5);
                scrollVelocity = holdDirection * holdSpeed;
            } else {
                scrollVelocity = dragVelocity;
            }
        } else if (keyPressed) {
            const acceleration = 0.35;
            const maxSpeed = 22;
            
            if (Math.sign(scrollVelocity) !== currentDirection) {
                scrollVelocity = currentDirection * Math.abs(scrollVelocity);
            }
            
            if (Math.abs(scrollVelocity) < maxSpeed) {
                scrollVelocity += currentDirection * acceleration;
                if (Math.abs(scrollVelocity) > maxSpeed) {
                    scrollVelocity = currentDirection * maxSpeed;
                }
            }
        } else {
            // Rychlejší útlum pro kratší setrvačnost
            const slowdownFactor = 0.972 + Math.min(Math.abs(scrollVelocity) / 105, 0.013); // Upraveno z 0.975 a 0.015
            scrollVelocity *= slowdownFactor;
        }
        
        if (Math.abs(scrollVelocity) > 0.1) {
            const isAtEdge = updatePosition(scrollVelocity);
            
            if (!isAtEdge) {
                requestAnimationFrame(smoothScroll);
            } else {
                scrollVelocity = 0;
                isAutoScrolling = false;
                currentDirection = 0;
                holdDirection = 0;
            }
        } else {
            scrollVelocity = 0;
            isAutoScrolling = false;
            currentDirection = 0;
            holdDirection = 0;
        }
    }

    // Zabráníme výběru textu během tažení
    container.addEventListener('selectstart', (e) => {
        if (isDragging) {
            e.preventDefault();
        }
    });

    // Přidáme prevenci výchozího chování pro drag
    container.addEventListener('dragstart', (e) => {
        e.preventDefault();
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
    
    // Použití will-change pro lepší vykreslování
    layers.forEach(layer => {
        layer.style.willChange = 'transform';
    });
    
    // Cleanup když není potřeba
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            layers.forEach(layer => {
                layer.style.willChange = 'auto';
            });
        }
    }, { passive: true });

    // Zakázání výchozího scroll chování
    document.addEventListener('wheel', (e) => {
        if (e.buttons === 4) { // Middle mouse button is pressed
            e.preventDefault();
        }
    }, { passive: false });

    // Zakázání auto-scroll funkce prohlížeče
    document.addEventListener('auxclick', (e) => {
        if (e.button === 1) {
            e.preventDefault();
        }
    });

    // Přidání prevence výchozího chování pro middle-click
    container.addEventListener('mousedown', (e) => {
        if (e.button === 1) {
            e.preventDefault();
        }
    });
});


