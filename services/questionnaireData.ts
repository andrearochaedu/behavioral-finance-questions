
import { Question } from '../types';

/**
 * BANCO DE PERGUNTAS - EDUCAÇÃO FINANCEIRA
 * Atualizado com pontuações específicas conforme PDF.
 * Pontuação conta a partir da Q07.
 */

export const FINANCIAL_QUESTIONS: Question[] = [
    // --- GERAIS (Sem pontuação relevante para o score final, mas mantendo estrutura) ---
    { 
        id: 'Q01', 
        category: 'general',
        introTitle: 'Gerais',
        introText: 'Perguntas introdutórias sobre sua percepção financeira.',
        text: 'Você se considera capaz de entender informações sobre produtos financeiros, como empréstimos ou investimentos?', 
        type: 'scale', 
        options: [
            { text: 'Discordo totalmente', score: 0 },
            { text: 'Discordo', score: 0 },
            { text: 'Nem concordo e nem discordo', score: 0 },
            { text: 'Concordo', score: 0 },
            { text: 'Concordo totalmente', score: 0 }
        ]
    },
    { 
        id: 'Q02', 
        category: 'general',
        text: 'Com que frequência você busca informações ou tira dúvidas sobre finanças pessoais?', 
        type: 'scale', 
        options: [
            { text: 'Sempre', score: 0 },
            { text: 'Frequentemente', score: 0 },
            { text: 'Às vezes', score: 0 },
            { text: 'Raramente', score: 0 },
            { text: 'Nunca', score: 0 }
        ]
    },
    { 
        id: 'Q03', 
        category: 'general',
        text: 'Que tipo de orientação financeira você gostaria de receber da cooperativa?', 
        type: 'multiple_choice', 
        options: [
            { text: 'Dicas de economia e controle de gastos', score: 0 },
            { text: 'Informações sobre investimentos', score: 0 },
            { text: 'Orientação sobre crédito e empréstimos', score: 0 },
            { text: 'Planejamento para aposentadoria', score: 0 },
            { text: 'Orientação para organização do orçamento', score: 0 },
            { text: 'Ajuda para sair de dívidas', score: 0 },
            { text: 'Nenhuma', score: 0 }
        ]
    },

    // --- PERFIL DOS RESPONDENTES (Sem pontuação para o score final) ---
    { 
        id: 'Q04', 
        category: 'profile',
        introTitle: 'Perfil dos respondentes',
        introText: 'As perguntas a seguir têm como objetivo traçar um perfil do usuário.',
        text: 'Qual é a sua idade (faixa etária)?', 
        type: 'multiple_choice',
        options: [
            { text: 'De 18 a 28 anos', score: 1 },
            { text: 'De 29 a 39 anos', score: 2 },
            { text: 'De 40 a 50 anos', score: 3 },
            { text: 'De 51 a 60 anos', score: 4 },
            { text: 'Igual ou superior a 61 anos', score: 5 }
        ]
    },
    { 
        id: 'Q05', 
        category: 'profile',
        text: 'Indique o gênero (sexo) no qual você se identifica:', 
        type: 'multiple_choice',
        options: [
            { text: 'Feminino', score: 2 },
            { text: 'Masculino', score: 1 },
            { text: 'Outros', score: 0 },
            { text: 'Prefiro não responder', score: 3 }
        ]
    },
    { 
        id: 'Q06', 
        category: 'profile',
        text: 'Qual é o seu estado civil?', 
        type: 'multiple_choice',
        options: [
            { text: 'Casado (a)', score: 1 },
            { text: 'Solteiro (a)', score: 2 },
            { text: 'Viúvo (a)', score: 3 },
            { text: 'Separado (a)', score: 4 },
            { text: 'Outros', score: 5 }
        ]
    },
    // Nota: Q07, Q08, Q09 originais do PDF eram demográficas (Dependentes, Escolaridade, Renda), 
    // mas no código anterior a numeração estava diferente. 
    // Vou ajustar para seguir EXATAMENTE a ordem e texto do PDF a partir daqui para a pontuação correta.
    // O PDF tem Q4, Q5, Q6 como demográficas. Q7 começa o Bem-estar.
    // Vou manter a estrutura de IDs sequenciais do código anterior mas com os textos e pontos do PDF.
    
    // Q07 do Código Atual = Q04 do PDF (Dependentes) - Não conta score
    { 
        id: 'Q07_Profile', 
        category: 'profile',
        text: 'Possui dependentes?', 
        type: 'multiple_choice', // Alterado de boolean para multiple_choice para consistência
        options: [
            { text: 'Sim', score: 1 },
            { text: 'Não', score: 2 }
        ]
    },
    // Q08 do Código = Q05 do PDF (Escolaridade) - Não conta score
    { 
        id: 'Q08_Profile', 
        category: 'profile',
        text: 'Qual é o seu nível de escolaridade?', 
        type: 'multiple_choice',
        options: [
            { text: 'Sem instrução', score: 1 },
            { text: 'Ensino fundamental incompleto', score: 2 },
            { text: 'Ensino fundamental completo', score: 3 },
            { text: 'Ensino médio incompleto', score: 4 },
            { text: 'Ensino médio completo', score: 5 },
            { text: 'Ensino superior incompleto', score: 6 },
            { text: 'Ensino superior completo', score: 7 },
            { text: 'Pós graduação', score: 8 },
            { text: 'Especialização, mestrado ou doutorado', score: 9 },
            { text: 'Outros', score: 10 }
        ]
    },
    // Q09 do Código = Q06 do PDF (Renda) - Não conta score
    { 
        id: 'Q09_Profile', 
        category: 'profile',
        text: 'Qual é a sua renda mensal individual?', 
        type: 'multiple_choice',
        options: [
            { text: 'Nenhum rendimento', score: 1 },
            { text: 'Até 1 salário mínimo', score: 2 },
            { text: 'De 1 a 2 salários mínimos', score: 3 },
            { text: 'De 2 a 3 salários mínimos', score: 4 },
            { text: 'De 3 a 5 salários mínimos', score: 5 },
            { text: 'De 5 a 10 salários mínimos', score: 6 },
            { text: 'Mais de 10 salários mínimos', score: 7 },
            { text: 'Não sei dizer ou prefiro não dizer', score: 8 }
        ]
    },

    // --- A PARTIR DAQUI COMEÇA O SCORE (Q07 do PDF) ---
    // Ajustei os IDs para Q07, Q08 etc para bater com o PDF visualmente, embora internamente seja string.

    // --- BEM-ESTAR FINANCEIRO ---
    { 
        id: 'Q07', 
        category: 'well_being',
        introTitle: 'Bem-estar financeiro',
        introText: 'Quão bem esta afirmação descreve você ou sua situação financeira?',
        text: '07. Você poderia lidar com uma grande despesa inesperada.', 
        type: 'scale',
        options: [
            { text: 'Completamente', score: 4 },
            { text: 'Muito bem', score: 3 },
            { text: 'Um pouco', score: 2 },
            { text: 'Muito pouco', score: 1 },
            { text: 'De modo nenhum', score: 0 }
        ]
    },
    { 
        id: 'Q08', 
        category: 'well_being',
        text: '08. Você está garantindo seu futuro financeiro.', 
        type: 'scale',
        options: [
            { text: 'Completamente', score: 4 },
            { text: 'Muito bem', score: 3 },
            { text: 'Um pouco', score: 2 },
            { text: 'Muito pouco', score: 1 },
            { text: 'De modo nenhum', score: 0 }
        ]
    },
    { 
        id: 'Q09', 
        category: 'well_being',
        text: '09. Por causa da sua situação financeira, você sente que nunca terá as coisas que quer na vida.', 
        type: 'scale',
        options: [
            { text: 'Completamente', score: 0 },
            { text: 'Muito bem', score: 1 },
            { text: 'Um pouco', score: 2 },
            { text: 'Muito pouco', score: 3 },
            { text: 'De modo nenhum', score: 4 }
        ]
    },
    { 
        id: 'Q10', 
        category: 'well_being',
        text: '10. Você pode aproveitar a vida devido à maneira como está administrando seu dinheiro.', 
        type: 'scale',
        options: [
            { text: 'Completamente', score: 4 },
            { text: 'Muito bem', score: 3 },
            { text: 'Um pouco', score: 2 },
            { text: 'Muito pouco', score: 1 },
            { text: 'De modo nenhum', score: 0 }
        ]
    },
    { 
        id: 'Q11', 
        category: 'well_being',
        text: '11. Você está apenas sobrevivendo financeiramente.', 
        type: 'scale',
        options: [
            { text: 'Completamente', score: 0 },
            { text: 'Muito bem', score: 1 },
            { text: 'Um pouco', score: 2 },
            { text: 'Muito pouco', score: 3 },
            { text: 'De modo nenhum', score: 4 }
        ]
    },
    { 
        id: 'Q12', 
        category: 'well_being',
        text: '12. Você está preocupado(a) que o dinheiro que tem ou terá economizado pode não ser suficiente.', 
        type: 'scale',
        options: [
            { text: 'Completamente', score: 0 },
            { text: 'Muito bem', score: 1 },
            { text: 'Um pouco', score: 2 },
            { text: 'Muito pouco', score: 3 },
            { text: 'De modo nenhum', score: 4 }
        ]
    },

    // --- BEM-ESTAR FINANCEIRO PARTE 2 ---
    { 
        id: 'Q13', 
        category: 'well_being',
        introTitle: 'Bem-estar financeiro (Parte 2)',
        introText: 'Com que frequência essa afirmação se aplica a você?',
        text: '13. Dar um presente de casamento, aniversário ou outra ocasião colocaria em dificuldade suas finanças do mês', 
        type: 'scale',
        options: [
            { text: 'Sempre', score: 0 },
            { text: 'Frequentemente', score: 1 },
            { text: 'Às vezes', score: 2 },
            { text: 'Raramente', score: 3 },
            { text: 'Nunca', score: 4 }
        ]
    },
    { 
        id: 'Q14', 
        category: 'well_being',
        text: '14. Você tem dinheiro sobrando no final do mês.', 
        type: 'scale',
        options: [
            { text: 'Sempre', score: 4 },
            { text: 'Frequentemente', score: 3 },
            { text: 'Às vezes', score: 2 },
            { text: 'Raramente', score: 1 },
            { text: 'Nunca', score: 0 }
        ]
    },
    { 
        id: 'Q15', 
        category: 'well_being',
        text: '15. Você NÃO está em dia com as suas finanças.', 
        type: 'scale',
        options: [
            { text: 'Sempre', score: 0 },
            { text: 'Frequentemente', score: 1 },
            { text: 'Às vezes', score: 2 },
            { text: 'Raramente', score: 3 },
            { text: 'Nunca', score: 4 }
        ]
    },
    { 
        id: 'Q16', 
        category: 'well_being',
        text: '16. Suas finanças controlam sua vida.', 
        type: 'scale',
        options: [
            { text: 'Sempre', score: 0 },
            { text: 'Frequentemente', score: 1 },
            { text: 'Às vezes', score: 2 },
            { text: 'Raramente', score: 3 },
            { text: 'Nunca', score: 4 }
        ]
    },

    // --- VIÉS AUTOCONTROLE ---
    { 
        id: 'Q17', 
        category: 'self_control',
        introTitle: 'Viés autocontrole',
        introText: 'O quanto as afirmações a seguir descrevem meu comportamento?',
        text: '17. Considero cuidadosamente as consequências das minhas decisões de compras antes de gastar.', 
        type: 'scale',
        options: [
            { text: 'Discordo totalmente', score: 1 },
            { text: 'Discordo', score: 2 },
            { text: 'Nem concordo e nem discordo', score: 3 },
            { text: 'Concordo', score: 4 },
            { text: 'Concordo totalmente', score: 5 }
        ]
    },
    { 
        id: 'Q18', 
        category: 'self_control',
        text: '18. Consigo seguir metas financeiras em longo prazo.', 
        type: 'scale',
        options: [
            { text: 'Discordo totalmente', score: 1 },
            { text: 'Discordo', score: 2 },
            { text: 'Nem concordo e nem discordo', score: 3 },
            { text: 'Concordo', score: 4 },
            { text: 'Concordo totalmente', score: 5 }
        ]
    },
    { 
        id: 'Q19', 
        category: 'self_control',
        text: '19. Consigo resistir a tentações para alcançar meus objetivos orçamentários.', 
        type: 'scale',
        options: [
            { text: 'Discordo totalmente', score: 1 },
            { text: 'Discordo', score: 2 },
            { text: 'Nem concordo e nem discordo', score: 3 },
            { text: 'Concordo', score: 4 },
            { text: 'Concordo totalmente', score: 5 }
        ]
    },
    { 
        id: 'Q20', 
        category: 'self_control',
        text: '20. Eu sei quando "dizer chega" em relação aos meus gastos.', 
        type: 'scale',
        options: [
            { text: 'Discordo totalmente', score: 1 },
            { text: 'Discordo', score: 2 },
            { text: 'Nem concordo e nem discordo', score: 3 },
            { text: 'Concordo', score: 4 },
            { text: 'Concordo totalmente', score: 5 }
        ]
    },

    // --- CONTABILIDADE MENTAL ---
    { 
        id: 'Q21', 
        category: 'mental_accounting',
        introTitle: 'Contabilidade mental',
        introText: 'O quanto as afirmações a seguir descrevem meu comportamento?',
        text: '21. É importante para mim acompanhar minhas movimentações financeiras com precisão.', 
        type: 'scale',
        options: [
            { text: 'Discordo totalmente', score: 1 },
            { text: 'Discordo', score: 2 },
            { text: 'Nem concordo e nem discordo', score: 3 },
            { text: 'Concordo', score: 4 },
            { text: 'Concordo totalmente', score: 5 }
        ]
    },
    { 
        id: 'Q22', 
        category: 'mental_accounting',
        text: '22. Eu costumo registrar meus ganhos e despesas, seja anotando em caderno, planilha, aplicativo ou de qualquer outra forma.', 
        type: 'scale',
        options: [
            { text: 'Discordo totalmente', score: 1 },
            { text: 'Discordo', score: 2 },
            { text: 'Nem concordo e nem discordo', score: 3 },
            { text: 'Concordo', score: 4 },
            { text: 'Concordo totalmente', score: 5 }
        ]
    },
    { 
        id: 'Q23', 
        category: 'mental_accounting',
        text: '23. Eu saberia dizer, pelo menos aproximadamente, quanto gastei neste mês.', 
        type: 'scale',
        options: [
            { text: 'Discordo totalmente', score: 1 },
            { text: 'Discordo', score: 2 },
            { text: 'Nem concordo e nem discordo', score: 3 },
            { text: 'Concordo', score: 4 },
            { text: 'Concordo totalmente', score: 5 }
        ]
    },
    { 
        id: 'Q24', 
        category: 'mental_accounting',
        text: '24. Eu separo meus gastos em diferentes categorias (como, por exemplo, alimentação, lazer, educação etc.).', 
        type: 'scale',
        options: [
            { text: 'Discordo totalmente', score: 1 },
            { text: 'Discordo', score: 2 },
            { text: 'Nem concordo e nem discordo', score: 3 },
            { text: 'Concordo', score: 4 },
            { text: 'Concordo totalmente', score: 5 }
        ]
    },
    { 
        id: 'Q25', 
        category: 'mental_accounting',
        text: '25. De modo geral, sou uma pessoa bem-organizada com relação ao meu dinheiro.', 
        type: 'scale',
        options: [
            { text: 'Discordo totalmente', score: 1 },
            { text: 'Discordo', score: 2 },
            { text: 'Nem concordo e nem discordo', score: 3 },
            { text: 'Concordo', score: 4 },
            { text: 'Concordo totalmente', score: 5 }
        ]
    },

    // --- ALFABETIZAÇÃO FINANCEIRA ---
    { 
        id: 'Q26', 
        category: 'literacy',
        introTitle: 'Alfabetização financeira',
        introText: 'O quanto as afirmações a seguir descrevem seu comportamento financeiro?',
        text: '26. Você anota e controla os seus gastos pessoais (ex.: planilha de receitas e despesas mensais).', 
        type: 'scale',
        options: [
            { text: 'Nunca', score: 1 },
            { text: 'Quase nunca', score: 2 },
            { text: 'Às vezes', score: 3 },
            { text: 'Quase sempre', score: 4 },
            { text: 'Sempre', score: 5 }
        ]
    },
    { 
        id: 'Q27', 
        category: 'literacy',
        text: '27. Você compara preços ao fazer uma compra.', 
        type: 'scale',
        options: [
            { text: 'Nunca', score: 1 },
            { text: 'Quase nunca', score: 2 },
            { text: 'Às vezes', score: 3 },
            { text: 'Quase sempre', score: 4 },
            { text: 'Sempre', score: 5 }
        ]
    },
    { 
        id: 'Q28', 
        category: 'literacy',
        text: '28. Você tem um plano de gastos/orçamento.', 
        type: 'scale',
        options: [
            { text: 'Nunca', score: 1 },
            { text: 'Quase nunca', score: 2 },
            { text: 'Às vezes', score: 3 },
            { text: 'Quase sempre', score: 4 },
            { text: 'Sempre', score: 5 }
        ]
    },
    { 
        id: 'Q29', 
        category: 'literacy',
        text: '29. Você paga suas contas em dia.', 
        type: 'scale',
        options: [
            { text: 'Nunca', score: 1 },
            { text: 'Quase nunca', score: 2 },
            { text: 'Às vezes', score: 3 },
            { text: 'Quase sempre', score: 4 },
            { text: 'Sempre', score: 5 }
        ]
    },
    { 
        id: 'Q30', 
        category: 'literacy',
        text: '30. Você analisa suas contas antes de fazer uma compra de alto valor.', 
        type: 'scale',
        options: [
            { text: 'Nunca', score: 1 },
            { text: 'Quase nunca', score: 2 },
            { text: 'Às vezes', score: 3 },
            { text: 'Quase sempre', score: 4 },
            { text: 'Sempre', score: 5 }
        ]
    },
    { 
        id: 'Q31', 
        category: 'literacy',
        text: '31. Você passa a poupar mais quando recebe um aumento de salário.', 
        type: 'scale',
        options: [
            { text: 'Nunca', score: 1 },
            { text: 'Quase nunca', score: 2 },
            { text: 'Às vezes', score: 3 },
            { text: 'Quase sempre', score: 4 },
            { text: 'Sempre', score: 5 }
        ]
    },
    { 
        id: 'Q32', 
        category: 'literacy',
        text: '32. Você faz uma reserva do dinheiro que recebe mensalmente para uma necessidade futura.', 
        type: 'scale',
        options: [
            { text: 'Nunca', score: 1 },
            { text: 'Quase nunca', score: 2 },
            { text: 'Às vezes', score: 3 },
            { text: 'Quase sempre', score: 4 },
            { text: 'Sempre', score: 5 }
        ]
    },
    { 
        id: 'Q33', 
        category: 'literacy',
        text: '33. Você guarda parte da sua renda todo o mês.', 
        type: 'scale',
        options: [
            { text: 'Nunca', score: 1 },
            { text: 'Quase nunca', score: 2 },
            { text: 'Às vezes', score: 3 },
            { text: 'Quase sempre', score: 4 },
            { text: 'Sempre', score: 5 }
        ]
    },
    { 
        id: 'Q34', 
        category: 'literacy',
        text: '34. Você guarda dinheiro regularmente para atingir objetivos financeiros de longo prazo (ex: educação, casa, aposentadoria).', 
        type: 'scale',
        options: [
            { text: 'Nunca', score: 1 },
            { text: 'Quase nunca', score: 2 },
            { text: 'Às vezes', score: 3 },
            { text: 'Quase sempre', score: 4 },
            { text: 'Sempre', score: 5 }
        ]
    },

    // --- ATITUDE FINANCEIRA ---
    { 
        id: 'Q35', 
        category: 'attitude',
        introTitle: 'Atitude financeira',
        introText: 'O quanto as afirmações a seguir descrevem sua atitude financeira?',
        text: '35. Para você é importante definir metas para o futuro.', 
        type: 'scale',
        options: [
            { text: 'Discordo totalmente', score: 1 },
            { text: 'Discordo', score: 2 },
            { text: 'Nem concordo e nem discordo', score: 3 },
            { text: 'Concordo', score: 4 },
            { text: 'Concordo totalmente', score: 5 }
        ]
    },
    { 
        id: 'Q36', 
        category: 'attitude',
        text: '36. Você acredita que a maneira como administra o seu dinheiro vai afetar o seu futuro.', 
        type: 'scale',
        options: [
            { text: 'Discordo totalmente', score: 1 },
            { text: 'Discordo', score: 2 },
            { text: 'Nem concordo e nem discordo', score: 3 },
            { text: 'Concordo', score: 4 },
            { text: 'Concordo totalmente', score: 5 }
        ]
    },
    { 
        id: 'Q37', 
        category: 'attitude',
        text: '37. Você não se preocupa com o futuro, vive apenas o presente.', 
        type: 'scale',
        options: [
            { text: 'Discordo totalmente', score: 5 },
            { text: 'Discordo', score: 4 },
            { text: 'Nem concordo e nem discordo', score: 3 },
            { text: 'Concordo', score: 2 },
            { text: 'Concordo totalmente', score: 1 }
        ]
    },
    { 
        id: 'Q38', 
        category: 'attitude',
        text: '38. Poupar é impossível para mim.', 
        type: 'scale',
        options: [
            { text: 'Discordo totalmente', score: 5 },
            { text: 'Discordo', score: 4 },
            { text: 'Nem concordo e nem discordo', score: 3 },
            { text: 'Concordo', score: 2 },
            { text: 'Concordo totalmente', score: 1 }
        ]
    },
    { 
        id: 'Q39', 
        category: 'attitude',
        text: '39. Depois de tomar uma decisão sobre dinheiro, você se preocupa muito com a sua decisão.', 
        type: 'scale',
        options: [
            { text: 'Discordo totalmente', score: 5 },
            { text: 'Discordo', score: 4 },
            { text: 'Nem concordo e nem discordo', score: 3 },
            { text: 'Concordo', score: 2 },
            { text: 'Concordo totalmente', score: 1 }
        ]
    },
    { 
        id: 'Q40', 
        category: 'attitude',
        text: '40. É difícil para mim construir um planejamento de gastos.', 
        type: 'scale',
        options: [
            { text: 'Discordo totalmente', score: 5 },
            { text: 'Discordo', score: 4 },
            { text: 'Nem concordo e nem discordo', score: 3 },
            { text: 'Concordo', score: 2 },
            { text: 'Concordo totalmente', score: 1 }
        ]
    },
    { 
        id: 'Q41', 
        category: 'attitude',
        text: '41. Você considera mais satisfatório gastar dinheiro do que poupar para o futuro.', 
        type: 'scale',
        options: [
            { text: 'Discordo totalmente', score: 5 },
            { text: 'Discordo', score: 4 },
            { text: 'Nem concordo e nem discordo', score: 3 },
            { text: 'Concordo', score: 2 },
            { text: 'Concordo totalmente', score: 1 }
        ]
    },
    { 
        id: 'Q42', 
        category: 'attitude',
        text: '42. Para você o dinheiro é feito para gastar.', 
        type: 'scale',
        options: [
            { text: 'Discordo totalmente', score: 5 },
            { text: 'Discordo', score: 4 },
            { text: 'Nem concordo e nem discordo', score: 3 },
            { text: 'Concordo', score: 2 },
            { text: 'Concordo totalmente', score: 1 }
        ]
    },

    // --- CONHECIMENTO FINANCEIRO ---
    { 
        id: 'Q43', 
        category: 'knowledge',
        introTitle: 'Conhecimento financeiro',
        introText: 'Marque a opção que julgar correta.',
        text: '43. Suponha que você tenha R$ 100,00 em uma conta poupança a uma taxa de juros composto de 10% ao ano. Depois de 5 anos, qual o valor você terá na poupança?', 
        type: 'multiple_choice',
        options: [
            { text: 'Mais do que R$ 150,00', score: 1 },
            { text: 'Exatamente R$ 150,00', score: 0 },
            { text: 'Menos do que R$ 150,00', score: 0 },
            { text: 'Não sabe', score: 0 }
        ]
    },
    { 
        id: 'Q44', 
        category: 'knowledge',
        text: '44. Suponha que em 2027 sua renda dobrará e os preços de todos os bens também dobrarão. Em 2027, o quanto você será capaz de comprar com a sua renda?', 
        type: 'multiple_choice',
        options: [
            { text: 'Mais do que hoje', score: 0 },
            { text: 'Exatamente o mesmo', score: 1 },
            { text: 'Menos do que hoje', score: 0 },
            { text: 'Não sabe', score: 0 }
        ]
    },
    { 
        id: 'Q45', 
        category: 'knowledge',
        text: '45. Considerando-se um longo período (ex.: 10 anos), qual ativo, normalmente, oferece maior retorno?', 
        type: 'multiple_choice',
        options: [
            { text: 'Poupança', score: 0 },
            { text: 'Ações', score: 1 },
            { text: 'Não sabe', score: 0 }
        ]
    },
    { 
        id: 'Q46', 
        category: 'knowledge',
        text: '46. Imagine que cinco amigos recebem uma doação de R$ 1.000,00 e precisam dividir o dinheiro igualmente entre eles. Quanto cada um vai ganhar?', 
        type: 'multiple_choice',
        options: [
            { text: 'R$ 100,00', score: 0 },
            { text: 'R$ 200,00', score: 1 },
            { text: 'R$ 1.000,00', score: 0 },
            { text: 'R$ 5.000,00', score: 0 },
            { text: 'Não sabe', score: 0 }
        ]
    },
    { 
        id: 'Q47', 
        category: 'knowledge',
        text: '47. Um investimento com alta taxa de retorno terá alta taxa de risco. Essa afirmação é:', 
        type: 'multiple_choice',
        options: [
            { text: 'Verdadeira', score: 1 },
            { text: 'Falsa', score: 0 },
            { text: 'Não sabe', score: 0 }
        ]
    },
    { 
        id: 'Q48', 
        category: 'knowledge',
        text: '48. Um empréstimo com duração de 15 anos normalmente exige pagamentos mensais maiores do que um empréstimo de 30 anos, mas o total de juros pagos ao final do empréstimo será menor. Essa afirmação é:', 
        type: 'multiple_choice',
        options: [
            { text: 'Verdadeira', score: 1 },
            { text: 'Falsa', score: 0 },
            { text: 'Não sabe', score: 0 }
        ]
    },
    { 
        id: 'Q49', 
        category: 'knowledge',
        text: '49. Suponha que você viu o mesmo televisor em duas lojas diferentes pelo preço inicial de R$ 1.000,00. A loja "A" oferece um desconto de R$ 150,00, enquanto a loja "B" oferece um desconto de 10%. Qual é a melhor alternativa?', 
        type: 'multiple_choice',
        options: [
            { text: 'Comprar na loja A', score: 1 },
            { text: 'Comprar na loja B', score: 0 },
            { text: 'Não sabe', score: 0 }
        ]
    },
    { 
        id: 'Q50', 
        category: 'knowledge',
        text: '50. Suponha que você realizou um empréstimo de R$ 10.000,00 para ser pago após um ano e o custo com os juros é R$ 600,00. A taxa de juros que você irá pagar nesse empréstimo é de:', 
        type: 'multiple_choice',
        options: [
            { text: '0,3% a.a.', score: 0 },
            { text: '0,6% a.a.', score: 0 },
            { text: '3% a.a.', score: 0 },
            { text: '6% a.a.', score: 1 }
        ]
    },
];
