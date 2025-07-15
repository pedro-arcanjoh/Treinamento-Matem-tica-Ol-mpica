document.addEventListener('DOMContentLoaded', () => {
    // Lógica para a página de LOGIN
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Impede o envio padrão do formulário

            const email = loginForm.email.value;
            const password = loginForm.password.value;

            // EXEMPLO BÁSICO: Apenas uma validação simples para demonstração.
            // EM UM SISTEMA REAL, VOCÊ ENVIARIA ESSES DADOS PARA UM SERVIDOR.
            if (email === 'teste@email.com' && password === 'senha123') {
                alert('Login bem-sucedido!');
                // Redirecionar para uma página restrita, por exemplo:
                window.location.href = 'index.html'; // Redireciona para a página inicial
            } else {
                alert('E-mail ou senha incorretos. Tente novamente.');
            }

            console.log('Tentativa de login:', { email, password });
        });
    }

    // Lógica para a página de CADASTRO
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Impede o envio padrão do formulário

            const email = registerForm.regEmail.value;
            const password = registerForm.regPassword.value;
            const confirmPassword = registerForm.confirmPassword.value;

            if (password !== confirmPassword) {
                alert('As senhas não coincidem. Por favor, digite novamente.');
                return; // Impede o restante da execução
            }

            // EXEMPLO BÁSICO: Apenas para demonstração.
            // EM UM SISTEMA REAL, VOCÊ ENVIARIA ESSES DADOS PARA UM SERVIDOR
            // PARA SALVAR O NOVO USUÁRIO.
            alert('Conta criada com sucesso! Agora você pode fazer login.');
            console.log('Novo usuário cadastrado:', { email, password });
            window.location.href = 'login.html'; // Redireciona para a página de login
        });
    }
});