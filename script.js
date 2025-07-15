document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger'); // Alterado de hb para hamburger
    const navList = document.querySelector('.nav-list'); // Alterado de navList para navList

    hamburger.addEventListener('click', () => {
        navList.classList.toggle('active');
        const icon = hamburger.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    document.querySelectorAll('.nav-list a').forEach(link => {
        link.addEventListener('click', () => {
            if (navList.classList.contains('active')) {
                navList.classList.remove('active');
                hamburger.querySelector('i').classList.replace('fa-times', 'fa-bars');
            }
        });
    });

    // Renderização dos módulos e banco de questões via JSON
    async function loadData() {
        const mods = await fetch('data/modulos.json').then(r => r.json());
        const bco = await fetch('data/exercicios.json').then(r => r.json());
        const modCont = document.getElementById('modulos-container');
        const banCont = document.getElementById('banco-container');

        mods.forEach(mod => {
            const d = document.createElement('div');
            d.className = 'modulo';
            d.innerHTML = `
                <h3>${mod.titulo}</h3>
                <iframe src="${mod.video}" allowfullscreen></iframe>
                <a href="${mod.material}" download class="btn btn-primary">📄 Material</a>
            `;
            mod.exercicios.forEach(ex => {
                const btns = ex.respostas.map(r => `<button class="ex-btn">${r}</button>`).join('');
                d.innerHTML += `<div class="ex-cont"><p><strong>Ex:</strong> ${ex.pergunta}</p>${btns}<p class="resposta-text"></p></div>`;
            });
            modCont.appendChild(d);
        });

        bco.forEach(b => {
            const d = document.createElement('div');
            d.className = 'conteudo';
            d.innerHTML = `<h3>${b.conteudo}</h3>`;
            b.questoes.forEach(q => {
                const btns = q.respostas.map(r => `<button class="ex-btn">${r}</button>`).join('');
                d.innerHTML += `<div class="ex-cont"><p><strong>Q:</strong> ${q.enunciado}</p>${btns}<p class="resposta-text"></p></div>`;
            });
            banCont.appendChild(d);
        });

        document.querySelectorAll('.ex-cont').forEach(cont => {
            cont.querySelectorAll('.ex-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const txt = cont.querySelector('.resposta-text');
                    // Assumindo que a primeira resposta em `respostas` é a correta para simplificação
                    const correta = btn.parentNode.querySelector('.ex-btn').textContent; // Ajustado para pegar a primeira opção como a "correta" (para o exemplo)
                    
                    if (btn.textContent === correta) {
                        txt.textContent = `✅ Correto!`;
                        txt.classList.remove('incorrect');
                        txt.classList.add('correct'); // Opcional: adicionar classe para verde
                    } else {
                        txt.textContent = `❌ Incorreto. A resposta correta é: ${correta}`;
                        txt.classList.remove('correct');
                        txt.classList.add('incorrect'); // Adiciona classe para vermelho
                    }
                });
            });
        });
    }

    loadData();
});