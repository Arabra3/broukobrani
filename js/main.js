// Dynamické načítání modulů
import('./audio.js').then(module => {
    window.audioManager = new module.AudioManager();
});

// Načteme deník ihned při načtení stránky
document.addEventListener('DOMContentLoaded', () => {
    import('./diary.js').then(module => {
        if (!window.diary) {
            window.diary = new module.Diary();
            // Otevřeme deník po krátké prodlevě, aby se vše stihlo načíst
            setTimeout(() => {
                window.diary.openDiary();
            }, 500);
        }
    });
});

// Ponecháme i listener pro ikonu
document.querySelector('.diary-icon').addEventListener('click', () => {
    if (window.diary) {
        window.diary.toggleDiary();
    } else {
        import('./diary.js').then(module => {
            window.diary = new module.Diary();
        });
    }
}); 