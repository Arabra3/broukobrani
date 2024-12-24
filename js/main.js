// Dynamické načítání modulů
import('./audio.js').then(module => {
    window.audioManager = new module.AudioManager();
});

// Načíst deník až po interakci
document.querySelector('.diary-icon').addEventListener('click', () => {
    import('./diary.js').then(module => {
        if (!window.diary) {
            window.diary = new module.Diary();
        }
    });
}); 