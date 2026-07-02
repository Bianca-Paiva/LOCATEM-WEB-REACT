/**
 * Dicionário de mensagens padrão utilizadas no fluxo de cadastro do usuário.
 * Centraliza os títulos e descrições para modais, alertas ou feedbacks visuais.
 */
export const CADASTRO_MESSAGES = {
    // Feedback para quando o usuário deixa campos obrigatórios em branco
    REQUIRED: {
        titulo: 'Campos obrigatórios',
        mensagem: 'Preencha todos os campos obrigatórios para continuar.',
    },

    // Feedback de validação do campo de Nome Completo
    INVALID_NAME: {
        titulo: 'Nome inválido',
        mensagem: 'Por favor, digite seu nome completo.',
    },

    // Feedback de validação do campo de E-mail
    INVALID_EMAIL: {
        titulo: 'E-mail inválido',
        mensagem: 'Digite um endereço de e-mail válido.',
    },

    // Feedback de validação do campo de Telefone/Celular
    INVALID_PHONE: {
        titulo: 'Telefone inválido',
        mensagem: 'Digite um telefone válido com DDD.',
    },

    // Feedback de validação do CPF (Pessoa Física)
    INVALID_CPF: {
        titulo: 'CPF inválido',
        mensagem: 'Digite seu CPF completo.',
    },

    // Feedback de validação do CNPJ (Pessoa Jurídica)
    INVALID_CNPJ: {
        titulo: 'CNPJ inválido',
        mensagem: 'Digite seu CNPJ completo.',
    },

    // Feedback de sucesso ao concluir o processo de cadastro
    SUCCESS: {
        titulo: 'Sucesso',
        mensagem: 'Conta criada com sucesso!',
    },

    // Feedback genérico para falhas de comunicação com o servidor/backend
    API_ERROR: {
        titulo: 'Erro',
        mensagem: 'Erro ao conectar com a API.',
    },
}