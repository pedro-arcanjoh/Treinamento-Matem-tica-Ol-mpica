document.addEventListener('DOMContentLoaded', () => {
    // Referências aos elementos HTML
    const contentGrid = document.getElementById('content-grid');
    const questionsSection = document.getElementById('questions-section');
    const currentContentTitle = document.getElementById('current-content-title');
    const backToContentsBtn = document.getElementById('back-to-contents');
    const questionListUl = document.getElementById('question-list');

    const questionDetailsSection = document.getElementById('question-details');
    const questionNumberEl = document.getElementById('question-number');
    const questionEnunciadoEl = questionDetailsSection.querySelector('.question-enunciado');
    const alternativesWrapper = questionDetailsSection.querySelector('.alternatives-wrapper');
    const confirmAnswerBtn = document.getElementById('confirm-answer');
    const answerFeedbackEl = questionDetailsSection.querySelector('.answer-feedback');
    const correctAlternativeInfoEl = questionDetailsSection.querySelector('.correct-alternative-info');
    const toggleSolutionBtn = document.getElementById('toggle-solution');
    const solutionArea = questionDetailsSection.querySelector('.solution-area'); // CORREÇÃO AQUI: Usando querySelector com a classe
    const questionSolutionEl = questionDetailsSection.querySelector('.question-solution');

    const prevQuestionBtn = document.getElementById('prev-question');
    const backToQuestionListBtn = document.getElementById('back-to-question-list');
    const nextQuestionBtn = document.getElementById('next-question');

    let allQuestions = {}; // Armazena todas as questões carregadas por conteúdo
    let currentContentId = '';
    let currentQuestionIndex = 0;
    let selectedAlternative = null; // Armazena a alternativa selecionada pelo usuário

    // --- Funções para Renderização e Navegação ---

    // Carrega os dados das questões do JSON
    async function loadQuestionsData() {
        try {
            const response = await fetch('data/questoes.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allQuestions = await response.json();
            renderContentCards(); // Renderiza os cards de conteúdo após carregar os dados
        } catch (error) {
            console.error("Erro ao carregar os dados das questões:", error);
            contentGrid.innerHTML = '<p>Não foi possível carregar as questões. Tente novamente mais tarde.</p>';
        }
    }

    // Renderiza os cards de conteúdo (Combinatória, Álgebra, etc.)
    function renderContentCards() {
        contentGrid.innerHTML = '';
        Object.keys(allQuestions).forEach(contentKey => {
            const content = allQuestions[contentKey];
            const contentCard = document.createElement('div');
            contentCard.className = 'content-card';
            contentCard.dataset.contentId = contentKey;
            contentCard.innerHTML = `
                <i class="${content.icon}"></i>
                <h3>${content.name}</h3>
            `;
            contentCard.addEventListener('click', () => showQuestionsList(contentKey));
            contentGrid.appendChild(contentCard);
        });
        // Garante que a seção principal esteja visível e as outras ocultas
        contentGrid.style.display = 'grid';
        questionsSection.style.display = 'none';
        questionDetailsSection.style.display = 'none';
    }

    // Mostra a lista de questões para um conteúdo específico
    function showQuestionsList(contentId) {
        currentContentId = contentId;
        const content = allQuestions[contentId];
        
        currentContentTitle.textContent = content.name;
        questionListUl.innerHTML = '';

        content.questions.forEach((q, index) => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="#">Questão ${index + 1}</a>`;
            li.addEventListener('click', (e) => {
                e.preventDefault(); // Impede o comportamento padrão do link
                showQuestionDetails(index);
            });
            questionListUl.appendChild(li);
        });

        contentGrid.style.display = 'none';
        questionsSection.style.display = 'block';
        questionDetailsSection.style.display = 'none';

        questionsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Mostra os detalhes de uma questão específica
    function showQuestionDetails(index) {
        currentQuestionIndex = index;
        const content = allQuestions[currentContentId];
        const question = content.questions[index];

        questionNumberEl.textContent = `Questão ${index + 1}`;
        questionEnunciadoEl.textContent = question.enunciado;
        
        alternativesWrapper.innerHTML = '';
        question.alternatives.forEach((alt, i) => {
            const btn = document.createElement('button');
            btn.className = 'alternative-item';
            btn.textContent = `${String.fromCharCode(65 + i)}) ${alt}`; // A, B, C, D, E
            btn.dataset.index = i;
            btn.addEventListener('click', () => selectAlternative(btn));
            alternativesWrapper.appendChild(btn);
        });

        // Resetar estado da questão para uma nova questão
        resetQuestionState();

        // Gerenciar botões de navegação (anterior/próxima)
        prevQuestionBtn.disabled = (currentQuestionIndex === 0);
        nextQuestionBtn.disabled = (currentQuestionIndex === content.questions.length - 1);

        contentGrid.style.display = 'none';
        questionsSection.style.display = 'none';
        questionDetailsSection.style.display = 'block';

        questionDetailsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Função para selecionar uma alternativa
    function selectAlternative(button) {
        // Remover classe 'selected' de todas as alternativas
        document.querySelectorAll('.alternative-item').forEach(btn => {
            btn.classList.remove('selected');
        });
        // Adicionar classe 'selected' à alternativa clicada
        button.classList.add('selected');
        selectedAlternative = parseInt(button.dataset.index); // Salva o índice da alternativa
    }

    // Função para confirmar a resposta
    function confirmAnswer() {
        if (selectedAlternative === null) {
            alert('Por favor, selecione uma alternativa antes de confirmar.');
            return;
        }

        const content = allQuestions[currentContentId];
        const question = content.questions[currentQuestionIndex];
        const correctAnswerIndex = question.correctAnswerIndex;
        const feedback = answerFeedbackEl;
        const correctInfo = correctAlternativeInfoEl;

        // Desabilitar botões de alternativa e confirmar para evitar múltiplas submissões
        document.querySelectorAll('.alternative-item').forEach(btn => btn.disabled = true);
        confirmAnswerBtn.disabled = true;

        if (selectedAlternative === correctAnswerIndex) {
            feedback.textContent = '✅ Parabéns! Resposta Correta!';
            feedback.classList.remove('incorrect');
            feedback.classList.add('correct');
            correctInfo.style.display = 'none';
        } else {
            const correctText = question.alternatives[correctAnswerIndex];
            feedback.textContent = '❌ Que pena! Resposta Incorreta.';
            feedback.classList.remove('correct');
            feedback.classList.add('incorrect');
            correctInfo.textContent = `A alternativa correta era: ${String.fromCharCode(65 + correctAnswerIndex)}) ${correctText}`;
            correctInfo.style.display = 'block';

            // Marcar a alternativa correta visualmente
            const correctAlternativeButton = document.querySelectorAll('.alternative-item')[correctAnswerIndex];
            if (correctAlternativeButton) {
                correctAlternativeButton.style.backgroundColor = 'lightgreen'; // Destaca a correta
                correctAlternativeButton.style.fontWeight = 'bold';
            }
        }

        toggleSolutionBtn.style.display = 'block'; // Mostrar botão de solução
    }

    // Função para mostrar/esconder a solução
    function toggleSolution() {
        if (solutionArea.style.display === 'none') {
            const content = allQuestions[currentContentId];
            const question = content.questions[currentQuestionIndex];
            questionSolutionEl.textContent = question.solution;
            solutionArea.style.display = 'block';
            toggleSolutionBtn.textContent = 'Esconder Solução';
        } else {
            solutionArea.style.display = 'none';
            toggleSolutionBtn.textContent = 'Ver Solução';
        }
    }

    // Resetar o estado da questão para a próxima ou ao recarregar
    function resetQuestionState() {
        selectedAlternative = null;
        document.querySelectorAll('.alternative-item').forEach(btn => {
            btn.classList.remove('selected');
            btn.style.backgroundColor = ''; // Remover cor de destaque de correta/incorreta
            btn.style.fontWeight = 'normal'; // Resetar fonte
            btn.disabled = false; // Reativar botões de alternativa
        });
        confirmAnswerBtn.disabled = false; // Reativar botão de confirmar
        answerFeedbackEl.textContent = '';
        answerFeedbackEl.classList.remove('correct', 'incorrect');
        correctAlternativeInfoEl.style.display = 'none';
        toggleSolutionBtn.style.display = 'none'; // Esconder botão de solução
        solutionArea.style.display = 'none'; // Esconder área da solução
        toggleSolutionBtn.textContent = 'Ver Solução'; // Resetar texto do botão
    }

    // --- Event Listeners ---
    backToContentsBtn.addEventListener('click', renderContentCards); // Voltar para os cards de conteúdo
    backToQuestionListBtn.addEventListener('click', () => showQuestionsList(currentContentId)); // Voltar para a lista de questões
    confirmAnswerBtn.addEventListener('click', confirmAnswer);
    toggleSolutionBtn.addEventListener('click', toggleSolution);

    prevQuestionBtn.addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            showQuestionDetails(currentQuestionIndex - 1);
        }
    });

    nextQuestionBtn.addEventListener('click', () => {
        const content = allQuestions[currentContentId];
        if (currentQuestionIndex < content.questions.length - 1) {
            showQuestionDetails(currentQuestionIndex + 1);
        }
    });

    // Carregar os dados ao iniciar a página
    loadQuestionsData();
});