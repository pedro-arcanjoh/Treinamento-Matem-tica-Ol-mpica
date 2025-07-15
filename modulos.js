document.addEventListener('DOMContentLoaded', () => {
    const modulesData = [
        {
            id: 'combinatoria',
            name: 'Combinatória',
            icon: 'fas fa-puzzle-piece',
            topics: [
                { name: 'Raciocínio Lógico', url: 'aulas/combinatoria/raciocinio-logico.html' },
                { name: 'Métodos de Contagem', url: 'aulas/combinatoria/metodos-contagem.html' },
                { name: 'Jogos', url: 'aulas/combinatoria/jogos.html' },
                { name: 'Princípio do Extremo', url: 'aulas/combinatoria/principio-extremo.html' },
                { name: 'Princípio da Casa dos Pombos', url: 'aulas/combinatoria/casa-pombos.html' },
                { name: 'Probabilidade', url: 'aulas/combinatoria/probabilidade.html' }
            ]
        },
        {
            id: 'algebra',
            name: 'Álgebra',
            icon: 'fas fa-calculator',
            topics: [
                { name: 'Produtos Notáveis', url: 'aulas/algebra/produtos-notaveis.html' },
                { name: 'Equações e Sistemas', url: 'aulas/algebra/equacoes-sistemas.html' },
                { name: 'Desigualdades', url: 'aulas/algebra/desigualdades.html' },
                { name: 'Funções (afim e quadrática)', url: 'aulas/algebra/funcoes.html' },
                { name: 'Polinômios', url: 'aulas/algebra/polinomios.html' },
                { name: 'Recorrências e sequências', url: 'aulas/algebra/recorrencias-sequencias.html' }
            ]
        },
        {
            id: 'geometria',
            name: 'Geometria',
            icon: 'fas fa-ruler-combined',
            topics: [
                { name: 'Conceitos Básicos', url: 'aulas/geometria/conceitos-basicos.html' },
                { name: 'Ângulos', url: 'aulas/geometria/angulos.html' },
                { name: 'Triângulos', url: 'aulas/geometria/triangulos.html' },
                { name: 'Quadriláteros', url: 'aulas/geometria/quadrilateros.html' },
                { name: 'Perímetros', url: 'aulas/geometria/perimetros.html' },
                { name: 'Áreas', url: 'aulas/geometria/areas.html' },
                { name: 'Congruências', url: 'aulas/geometria/congruencias.html' },
                { name: 'Semelhanças', url: 'aulas/geometria/semelhancas.html' },
                { name: 'Teorema de Pitágoras', url: 'aulas/geometria/pitagoras.html' },
                { name: 'Ângulos na Circunferência', url: 'aulas/geometria/angulos-circunferencia.html' },
                { name: 'Teorema de Tales', url: 'aulas/geometria/tales.html' },
                { name: 'Geometria em 3D', url: 'aulas/geometria/geometria-3d.html' }
            ]
        },
        {
            id: 'aritmetica',
            name: 'Aritmética',
            icon: 'fas fa-sort-numeric-up-alt',
            topics: [
                { name: 'Paridade', url: 'aulas/aritmetica/paridade.html' },
                { name: 'Divisibilidade', url: 'aulas/aritmetica/divisibilidade.html' },
                { name: 'Múltiplos e Divisores', url: 'aulas/aritmetica/multiplos-divisores.html' },
                { name: 'Algoritmo de Euclides', url: 'aulas/aritmetica/euclides.html' }
            ]
        }
    ];

    const modulesListDiv = document.getElementById('modules-list');
    const topicsListSection = document.getElementById('topics-list');
    const currentModuleTitle = document.getElementById('current-module-title');
    const topicListUl = topicsListSection.querySelector('.topic-list');
    const backToModulesBtn = document.getElementById('back-to-modules');

    // Função para renderizar os módulos
    function renderModules() {
        modulesListDiv.innerHTML = ''; // Limpa a lista existente
        modulesData.forEach(module => {
            const moduleCard = document.createElement('div');
            moduleCard.className = 'module-card';
            moduleCard.dataset.moduleId = module.id; // Para identificar o módulo clicado
            moduleCard.innerHTML = `
                <i class="${module.icon}"></i>
                <h3>${module.name}</h3>
            `;
            moduleCard.addEventListener('click', () => showTopics(module));
            modulesListDiv.appendChild(moduleCard);
        });
        modulesListDiv.style.display = 'grid'; // Garante que a grade de módulos seja exibida
        topicsListSection.style.display = 'none'; // Garante que a seção de tópicos esteja oculta
    }

    // Função para mostrar os tópicos de um módulo
    function showTopics(module) {
        modulesListDiv.style.display = 'none'; // Oculta a lista de módulos
        topicsListSection.style.display = 'block'; // Exibe a seção de tópicos

        currentModuleTitle.textContent = module.name;
        topicListUl.innerHTML = ''; // Limpa os tópicos anteriores

        module.topics.forEach(topic => {
            const li = document.createElement('li');
            // Altera o href para a URL real da página da aula
            li.innerHTML = `<a href="${topic.url}">${topic.name}</a>`;
            topicListUl.appendChild(li);
        });

        // Rolagem suave para o topo da seção de tópicos
        topicsListSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Event listener para o botão "Voltar aos Módulos"
    backToModulesBtn.addEventListener('click', renderModules);

    // Renderiza os módulos quando a página carrega
    renderModules();
});