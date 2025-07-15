document.addEventListener('DOMContentLoaded', async () => {
    // 1. Identificar o tópico atual (usando a URL da página)
    const pathParts = window.location.pathname.split('/');
    const moduleName = pathParts[pathParts.length - 2]; // Ex: "combinatoria"
    const topicFileName = pathParts[pathParts.length - 1].replace('.html', ''); // Ex: "raciocinio-logico"

    let allModulesData = {}; // Para ter acesso a todos os módulos e seus tópicos
    let currentModuleTopics = []; // Tópicos do módulo atual para navegação
    let currentTopicIndex = -1; // Índice do tópico atual dentro do módulo

    // Referências aos elementos HTML da página de aula
    const lessonTitleEl = document.getElementById('lesson-title');
    const lessonIntroTextEl = document.querySelector('.lesson-intro-text');
    const youtubeVideoIframe = document.getElementById('youtube-video');
    const materialPdfLink = document.getElementById('material-pdf-link');
    const materialDescriptionEl = document.getElementById('material-description');

    const exercisesSection = document.getElementById('exercises-section');
    const exerciseListGrid = document.getElementById('exercise-list');
    const exerciseDetailsSection = document.getElementById('exercise-details');
    const exerciseNumberEl = document.getElementById('exercise-number');
    const exerciseEnunciadoEl = exerciseDetailsSection.querySelector('.exercise-enunciado');
    const alternativesWrapper = exerciseDetailsSection.querySelector('.alternatives-wrapper');
    const confirmAnswerBtn = document.getElementById('confirm-exercise-answer');
    const answerFeedbackEl = exerciseDetailsSection.querySelector('.exercise-answer-feedback');
    const correctAlternativeInfoEl = exerciseDetailsSection.querySelector('.exercise-correct-alternative-info');
    const toggleSolutionBtn = document.getElementById('toggle-exercise-solution');
    const solutionArea = exerciseDetailsSection.querySelector('.exercise-solution-area');
    const exerciseSolutionEl = exerciseDetailsSection.querySelector('.exercise-solution');

    const backToTopicsBtn = document.getElementById('back-to-topics-btn');
    const prevLessonBtn = document.getElementById('prev-lesson-btn');
    const nextLessonBtn = document.getElementById('next-lesson-btn');
    const prevExerciseBtn = document.getElementById('prev-exercise');
    const backToExerciseListBtn = document.getElementById('back-to-exercise-list');
    const nextExerciseBtn = document.getElementById('next-exercise');

    let currentTopicExercises = []; // Exercícios específicos para este tópico
    let currentExerciseIndex = 0;
    let selectedAlternative = null;

    // 2. Carregar dados dos módulos (para navegação entre aulas) e exercícios do tópico
    async function loadLessonData() {
        try {
            // Carrega os dados de modulesData do modulos.js para navegação entre aulas
            const modulesResponse = await fetch('../../modulos.js'); // Pode ser um pouco mais complexo de "ler"
            // Para simplificar, vamos duplicar a estrutura ou criar um JSON de módulos
            // Neste exemplo, vamos assumir que `modulosData` pode ser acessado se fosse global,
            // ou re-declarado aqui para fins de exemplo (melhor é ter um JSON separado para módulos)
            // Para um projeto maior, recomendo criar um `data/modulos-info.json`
            
            // Para este template, vou duplicar a estrutura de módulos aqui para a navegação funcionar
            allModulesData = [
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

            const exercisesResponse = await fetch('../../data/aulas-exercicios.json');
            if (!exercisesResponse.ok) {
                throw new Error(`HTTP error! status: ${exercisesResponse.status}`);
            }
            const allExercisesData = await exercisesResponse.json();

            // Encontrar o módulo e tópico atual
            const currentModule = allModulesData.find(m => m.id === moduleName);
            if (currentModule) {
                currentModuleTopics = currentModule.topics;
                const currentTopic = currentModuleTopics.find(t => t.url.includes(topicFileName));
                if (currentTopic) {
                    lessonTitleEl.textContent = currentTopic.name;
                    currentTopicIndex = currentModuleTopics.indexOf(currentTopic);
                }
            }

            // Atribuir exercícios específicos a este tópico
            currentTopicExercises = allExercisesData[moduleName]?.[topicFileName]?.exercises || [];

            renderLessonContent();
            renderExerciseList();
            updateLessonNavigationButtons();

        } catch (error) {
            console.error("Erro ao carregar os dados da aula:", error);
            lessonIntroTextEl.textContent = "Não foi possível carregar o conteúdo da aula. Tente novamente mais tarde.";
            // Desabilita seções em caso de erro
            youtubeVideoIframe.style.display = 'none';
            materialPdfLink.style.display = 'none';
            exercisesSection.style.display = 'none';
        }
    }

    // 3. Renderizar o conteúdo da aula (vídeo, material)
    function renderLessonContent() {
        // Exemplo de dados para a aula atual - VOCÊ PRECISARÁ ADAPTAR ISSO
        // Idealmente, você teria outro JSON com detalhes da aula (vídeoId, pdfUrl, descrição)
        // Ou o `aulas-exercicios.json` poderia ser mais completo.
        // Por enquanto, vou usar dados mockados para demonstração.

        const mockLessonData = {
            'combinatoria': {
                'raciocinio-logico': {
                    videoUrl: 'https://www.youtube.com/embed/videoseries?list=PL_vV5BvJ6d1tWl24_i_n6Q-xXz9G9L7A5', // Exemplo de playlist
                    pdfUrl: '../../materials/combinatoria/raciocinio-logico.pdf', // Crie essa pasta e arquivos!
                    description: 'Esta aula aborda os fundamentos do raciocínio lógico, essenciais para a resolução de problemas em combinatória. Aprenda sobre proposições, conectivos e tabelas-verdade.'
                },
                'metodos-contagem': {
                    videoUrl: 'https://www.youtube.com/embed/videoseries?list=PL_vV5BvJ6d1uW3s2c6o0g-fF9s9L9K6H6',
                    pdfUrl: '../../materials/combinatoria/metodos-contagem.pdf',
                    description: 'Explore os principais métodos de contagem, incluindo o Princípio Fundamental da Contagem, permutações, arranjos e combinações.'
                }
                // ... adicione dados para todos os seus tópicos aqui
            },
            'algebra': {
                'produtos-notaveis': {
                    videoUrl: 'https://www.youtube.com/embed/videoseries?list=PL_vV5BvJ6d1uY8_c4b9l9m-p9q9e6o4D4',
                    pdfUrl: '../../materials/algebra/produtos-notaveis.pdf',
                    description: 'Aprenda e pratique os produtos notáveis mais importantes para simplificar expressões e resolver equações.'
                }
            },
            'geometria': {
                'conceitos-basicos': {
                    videoUrl: 'https://www.youtube.com/embed/videoseries?list=PL_vV5BvJ6d1tS3b7n2c0x9l0a0m1f0j0',
                    pdfUrl: '../../materials/geometria/conceitos-basicos.pdf',
                    description: 'Entenda os conceitos fundamentais da geometria, como ponto, reta, plano e suas propriedades.'
                }
            },
            'aritmetica': {
                'paridade': {
                    videoUrl: 'https://www.youtube.com/embed/videoseries?list=PL_vV5BvJ6d1tP1e4q5r6s7t8u9v0w1x2',
                    pdfUrl: '../../materials/aritmetica/paridade.pdf',
                    description: 'Explore o conceito de paridade e suas aplicações na resolução de problemas aritméticos.'
                }
            }
        };

        const lesson = mockLessonData[moduleName]?.[topicFileName];

        if (lesson) {
            lessonIntroTextEl.textContent = lesson.description;
            youtubeVideoIframe.src = lesson.videoUrl;
            materialPdfLink.href = lesson.pdfUrl;
            materialPdfLink.style.display = 'inline-block'; // Mostra o botão de download
        } else {
            // Caso não encontre dados para este tópico específico
            lessonIntroTextEl.textContent = "Conteúdo da aula não disponível ou em construção.";
            youtubeVideoIframe.style.display = 'none';
            materialPdfLink.style.display = 'none';
        }
    }

    // 4. Renderizar a lista de exercícios do tópico
    function renderExerciseList() {
        exerciseListGrid.innerHTML = '';
        if (currentTopicExercises.length === 0) {
            exerciseListGrid.innerHTML = '<p>Nenhum exercício disponível para este tópico ainda.</p>';
            return;
        }

        exercisesSection.style.display = 'block'; // Garante que a seção de exercícios esteja visível
        exerciseDetailsSection.style.display = 'none'; // Garante que os detalhes do exercício estejam ocultos

        currentTopicExercises.forEach((_, index) => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="#">Exercício ${index + 1}</a>`;
            li.addEventListener('click', (e) => {
                e.preventDefault();
                showExerciseDetails(index);
            });
            exerciseListGrid.appendChild(li);
        });
        exerciseListGrid.style.display = 'grid'; // Mostrar a grade da lista de exercícios
    }

    // 5. Mostrar os detalhes de um exercício específico
    function showExerciseDetails(index) {
        currentExerciseIndex = index;
        const exercise = currentTopicExercises[index];

        if (!exercise) {
            console.error("Exercício não encontrado no índice:", index);
            return;
        }

        exerciseNumberEl.textContent = `Exercício ${index + 1}`;
        exerciseEnunciadoEl.textContent = exercise.enunciado;
        
        alternativesWrapper.innerHTML = '';
        exercise.alternatives.forEach((alt, i) => {
            const btn = document.createElement('button');
            btn.className = 'alternative-item';
            btn.textContent = `${String.fromCharCode(65 + i)}) ${alt}`;
            btn.dataset.index = i;
            btn.addEventListener('click', () => selectAlternative(btn));
            alternativesWrapper.appendChild(btn);
        });

        resetExerciseState(); // Resetar o estado para o novo exercício

        // Gerenciar botões de navegação de exercício
        prevExerciseBtn.disabled = (currentExerciseIndex === 0);
        nextExerciseBtn.disabled = (currentExerciseIndex === currentTopicExercises.length - 1);

        exerciseListGrid.style.display = 'none'; // Oculta a lista de exercícios
        exerciseDetailsSection.style.display = 'block'; // Exibe os detalhes do exercício

        exerciseDetailsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Função para selecionar uma alternativa de exercício
    function selectAlternative(button) {
        document.querySelectorAll('.alternative-item').forEach(btn => {
            btn.classList.remove('selected');
        });
        button.classList.add('selected');
        selectedAlternative = parseInt(button.dataset.index);
    }

    // Função para confirmar a resposta do exercício
    function confirmExerciseAnswer() {
        if (selectedAlternative === null) {
            alert('Por favor, selecione uma alternativa antes de confirmar.');
            return;
        }

        const exercise = currentTopicExercises[currentExerciseIndex];
        const correctAnswerIndex = exercise.correctAnswerIndex;
        const feedback = answerFeedbackEl;
        const correctInfo = correctAlternativeInfoEl;

        document.querySelectorAll('.alternative-item').forEach(btn => btn.disabled = true);
        confirmAnswerBtn.disabled = true;

        if (selectedAlternative === correctAnswerIndex) {
            feedback.textContent = '✅ Parabéns! Resposta Correta!';
            feedback.classList.remove('incorrect');
            feedback.classList.add('correct');
            correctInfo.style.display = 'none';
        } else {
            const correctText = exercise.alternatives[correctAnswerIndex];
            feedback.textContent = '❌ Que pena! Resposta Incorreta.';
            feedback.classList.remove('correct');
            feedback.classList.add('incorrect');
            correctInfo.textContent = `A alternativa correta era: ${String.fromCharCode(65 + correctAnswerIndex)}) ${correctText}`;
            correctInfo.style.display = 'block';

            const correctAlternativeButton = document.querySelectorAll('.alternative-item')[correctAnswerIndex];
            if (correctAlternativeButton) {
                correctAlternativeButton.style.backgroundColor = 'lightgreen';
                correctAlternativeButton.style.fontWeight = 'bold';
            }
        }
        toggleSolutionBtn.style.display = 'block';
    }

    // Função para mostrar/esconder a solução do exercício
    function toggleExerciseSolution() {
        if (solutionArea.style.display === 'none') {
            const exercise = currentTopicExercises[currentExerciseIndex];
            exerciseSolutionEl.textContent = exercise.solution;
            solutionArea.style.display = 'block';
            toggleSolutionBtn.textContent = 'Esconder Solução';
        } else {
            solutionArea.style.display = 'none';
            toggleSolutionBtn.textContent = 'Ver Solução';
        }
    }

    // Resetar o estado de um exercício
    function resetExerciseState() {
        selectedAlternative = null;
        document.querySelectorAll('.alternative-item').forEach(btn => {
            btn.classList.remove('selected');
            btn.style.backgroundColor = '';
            btn.style.fontWeight = 'normal';
            btn.disabled = false;
        });
        confirmAnswerBtn.disabled = false;
        answerFeedbackEl.textContent = '';
        answerFeedbackEl.classList.remove('correct', 'incorrect');
        correctAlternativeInfoEl.style.display = 'none';
        toggleSolutionBtn.style.display = 'none';
        solutionArea.style.display = 'none';
        toggleSolutionBtn.textContent = 'Ver Solução';
    }

    // --- Funções de Navegação entre Aulas (no mesmo módulo) ---
    function updateLessonNavigationButtons() {
        if (currentTopicIndex > 0) {
            prevLessonBtn.style.display = 'inline-block';
            prevLessonBtn.onclick = () => {
                window.location.href = currentModuleTopics[currentTopicIndex - 1].url;
            };
        } else {
            prevLessonBtn.style.display = 'none';
        }

        if (currentTopicIndex < currentModuleTopics.length - 1) {
            nextLessonBtn.style.display = 'inline-block';
            nextLessonBtn.onclick = () => {
                window.location.href = currentModuleTopics[currentTopicIndex + 1].url;
            };
        } else {
            nextLessonBtn.style.display = 'none';
        }
    }

    // --- Event Listeners ---
    backToTopicsBtn.addEventListener('click', () => {
        window.location.href = '../../modulos.html'; // Volta para a página de módulos
    });

    // Eventos para exercícios
    backToExerciseListBtn.addEventListener('click', renderExerciseList);
    confirmAnswerBtn.addEventListener('click', confirmExerciseAnswer);
    toggleSolutionBtn.addEventListener('click', toggleExerciseSolution);

    prevExerciseBtn.addEventListener('click', () => {
        if (currentExerciseIndex > 0) {
            showExerciseDetails(currentExerciseIndex - 1);
        }
    });

    nextExerciseBtn.addEventListener('click', () => {
        if (currentExerciseIndex < currentTopicExercises.length - 1) {
            showExerciseDetails(currentExerciseIndex + 1);
        }
    });

    // Iniciar o carregamento dos dados da aula
    loadLessonData();
});