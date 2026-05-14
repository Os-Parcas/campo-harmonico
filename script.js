// Dados do Ciclo das Quintas
const CHORDS = [
    { major: 'C', minor: 'Am', dim: 'B°', name: 'Dó' },
    { major: 'G', minor: 'Em', dim: 'F#°', name: 'Sol' },
    { major: 'D', minor: 'Bm', dim: 'C#°', name: 'Ré' },
    { major: 'A', minor: 'F#m', dim: 'G#°', name: 'Lá' },
    { major: 'E', minor: 'C#m', dim: 'D#°', name: 'Mi' },
    { major: 'B', minor: 'G#m', dim: 'A#°', name: 'Si' },
    { major: 'Gb', minor: 'Ebm', dim: 'F°', name: 'Sol Bemol' },
    { major: 'Db', minor: 'Bbm', dim: 'C°', name: 'Ré Bemol' },
    { major: 'Ab', minor: 'Fm', dim: 'G°', name: 'Lá Bemol' },
    { major: 'Eb', minor: 'Cm', dim: 'D°', name: 'Mi Bemol' },
    { major: 'Bb', minor: 'Gm', dim: 'A°', name: 'Si Bemol' },
    { major: 'F', minor: 'Dm', dim: 'E°', name: 'Fá' }
];

class HarmonicApp {
    constructor() {
        this.currentIndex = 0;
        
        // Elementos da UI
        this.wheelElement = document.getElementById('wheel');
        this.radialLinesContainer = document.getElementById('radial-lines');
        this.panelTitle = document.getElementById('panel-title');
        
        this.deg1 = document.getElementById('val-deg1');
        this.deg2 = document.getElementById('val-deg2');
        this.deg3 = document.getElementById('val-deg3');
        this.deg4 = document.getElementById('val-deg4');
        this.deg5 = document.getElementById('val-deg5');
        this.deg6 = document.getElementById('val-deg6');
        this.deg7 = document.getElementById('val-deg7');
        
        this.btnLeft = document.getElementById('btn-left');
        this.btnRight = document.getElementById('btn-right');

        this.slicesData = [];

        this.init();
    }

    init() {
        this.buildGeometry();
        this.buildWheel();
        this.updateUI();
        this.bindEvents();
    }

    // Constrói as 12 linhas radiais fixas na base geométrica
    buildGeometry() {
        for (let i = 0; i < 6; i++) { // 6 linhas inteiras formam 12 fatias
            const angle = i * 30 + 15; // Defasado 15 graus para separar as fatias
            const line = document.createElement('div');
            line.className = 'radial-line';
            line.style.transform = `rotate(${angle}deg)`;
            this.radialLinesContainer.appendChild(line);
        }
    }

    // Constrói a roda apenas com os textos
    buildWheel() {
        CHORDS.forEach((chord, i) => {
            const angle = i * 30; // 360 / 12 fatias
            
            const slice = document.createElement('div');
            slice.className = 'slice';
            slice.style.transform = `rotate(${angle}deg)`;
            
            // As fatias não usam retângulos pintados no fundo para não quebrar a geometria do disco
            slice.innerHTML = `
                <div class="chord-label major">${chord.major}</div>
                <div class="chord-label minor">${chord.minor}</div>
                <div class="chord-label dim">${chord.dim}</div>
            `;
            
            this.wheelElement.appendChild(slice);

            const elMajor = slice.querySelector('.major');
            const elMinor = slice.querySelector('.minor');
            const elDim = slice.querySelector('.dim');
            this.slicesData.push({ elMajor, elMinor, elDim });
        });
    }

    // Atualiza a rotação, o painel e a iluminação inteligente
    updateUI() {
        const rotationAngle = -this.currentIndex * 30;
        this.wheelElement.style.transform = `rotate(${rotationAngle}deg)`;

        const tonicIndex = ((this.currentIndex % 12) + 12) % 12;
        const subdominantIndex = (tonicIndex + 11) % 12;
        const dominantIndex = (tonicIndex + 1) % 12;

        // Atualiza a iluminação visual dos textos (sem backgrounds retangulares)
        this.slicesData.forEach((slice, i) => {
            // Reset para estado inativo
            slice.elMajor.className = 'chord-label major';
            slice.elMinor.className = 'chord-label minor';
            slice.elDim.className = 'chord-label dim';

            // Iluminação por função harmônica (Glow + Cor da Fonte)
            if (i === tonicIndex) {
                slice.elMajor.classList.add('active-tonic'); // I
                slice.elMinor.classList.add('active-minor'); // vi
                slice.elDim.classList.add('active-dim');     // vii°
            } else if (i === subdominantIndex) {
                slice.elMajor.classList.add('active-major'); // IV
                slice.elMinor.classList.add('active-minor'); // ii
            } else if (i === dominantIndex) {
                slice.elMajor.classList.add('active-major'); // V
                slice.elMinor.classList.add('active-minor'); // iii
            }
        });

        const tonicChord = CHORDS[tonicIndex];
        const subChord = CHORDS[subdominantIndex];
        const domChord = CHORDS[dominantIndex];

        // Título formatado premium
        this.panelTitle.innerText = `${tonicChord.name} Maior (${tonicChord.major})`;

        // Atualiza os cartões no Dashboard
        this.deg1.innerText = tonicChord.major;   // I
        this.deg2.innerText = subChord.minor;     // ii
        this.deg3.innerText = domChord.minor;     // iii
        this.deg4.innerText = subChord.major;     // IV
        this.deg5.innerText = domChord.major;     // V
        this.deg6.innerText = tonicChord.minor;   // vi
        this.deg7.innerText = tonicChord.dim;     // vii°
    }

    bindEvents() {
        if (this.btnLeft) {
            this.btnLeft.addEventListener('click', () => {
                this.currentIndex--;
                this.updateUI();
            });
        }

        if (this.btnRight) {
            this.btnRight.addEventListener('click', () => {
                this.currentIndex++;
                this.updateUI();
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new HarmonicApp();
});
