
import React, { useState, useEffect } from 'react';
import { FINANCIAL_QUESTIONS } from '../services/questionnaireData';
import { storageService } from '../services/storageService';
import { User, Assessment, AssessmentAnswer } from '../types';
import { 
    ArrowRightIcon, 
    ArrowLeftIcon, 
    ChartBarIcon, 
    PlayIcon, 
    CheckCircleIcon,
    ArrowPathIcon,
    HomeIcon,
    ShieldCheckIcon,
    ClipboardDocumentCheckIcon,
    LightBulbIcon
} from '@heroicons/react/24/outline';

interface FinancialAssessmentProps {
    user: User;
    onGoBack?: () => void;
}

// Tabela de Conciliação conforme PDF (Pontuação -> Score)
const SCORE_LOOKUP: Record<number, number> = {
    0: 14, 1: 19, 2: 22, 3: 25, 4: 27, 5: 29, 6: 31, 7: 32, 8: 34, 9: 35,
    10: 37, 11: 38, 12: 40, 13: 41, 14: 42, 15: 44, 16: 45, 17: 46, 18: 47, 19: 49,
    20: 50, 21: 51, 22: 52, 23: 54, 24: 55, 25: 56, 26: 58, 27: 59, 28: 60, 29: 62,
    30: 63, 31: 65, 32: 66, 33: 68, 34: 69, 35: 71, 36: 73, 37: 75, 38: 78, 39: 81, 40: 86
};

// Helper to detect dark mode
const isDarkMode = () => document.documentElement.classList.contains('dark');

const CATEGORY_LABELS: Record<string, string> = {
    well_being: 'Bem-estar',
    self_control: 'Autocontrole',
    mental_accounting: 'Organização',
    literacy: 'Hábito',
    attitude: 'Atitude',
    knowledge: 'Conhecimento'
};

const FinancialAssessment: React.FC<FinancialAssessmentProps> = ({ user, onGoBack }) => {
    const [step, setStep] = useState<'intro' | 'quiz' | 'processing' | 'result'>('intro');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>({}); 
    const [assessmentResult, setAssessmentResult] = useState<Assessment | null>(null);

    useEffect(() => {
        const loadPrevious = async () => {
            const prev = await storageService.getLatestAssessment(user.id);
            if (prev) {
                setAssessmentResult(prev);
                setStep('intro');
            }
        };
        loadPrevious();
    }, [user.id]);

    const handleStart = () => {
        setStep('quiz');
        setCurrentQuestionIndex(0);
        setAnswers({});
    };

    const handleAnswer = (optionIndex: number) => {
        const currentQ = FINANCIAL_QUESTIONS[currentQuestionIndex];
        const selectedOption = currentQ.options?.[optionIndex];
        const score = selectedOption ? selectedOption.score : 0;

        const newAnswers = { ...answers, [currentQ.id]: score };
        setAnswers(newAnswers);

        if (currentQuestionIndex < FINANCIAL_QUESTIONS.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            finishAssessment(newAnswers);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const calculateScore = (finalAnswersScores: Record<string, number>) => {
        const categoryScores: Record<string, { total: number; count: number; maxPossible: number }> = {};
        let behaviorSum = 0; // Soma para o score principal

        FINANCIAL_QUESTIONS.forEach(q => {
            const score = finalAnswersScores[q.id] || 0;
            
            let maxQScore = 0;
            if (q.options) {
                maxQScore = Math.max(...q.options.map(o => o.score));
            }

            if (!categoryScores[q.category]) {
                categoryScores[q.category] = { total: 0, count: 0, maxPossible: 0 };
            }
            categoryScores[q.category].total += score;
            categoryScores[q.category].maxPossible += maxQScore;
            categoryScores[q.category].count += 1;

            if (q.category === 'well_being') {
                behaviorSum += score;
            }
        });

        const filteredCategories = Object.keys(categoryScores).filter(cat => cat !== 'general' && cat !== 'profile');
        
        const chartDataPoints = filteredCategories.map(cat => {
            const catData = categoryScores[cat];
            const normalized = catData.maxPossible > 0 
                ? Math.round((catData.total / catData.maxPossible) * 100) 
                : 0;
            
            return {
                subject: CATEGORY_LABELS[cat] || cat,
                A: normalized,
            };
        });

        const scoreFromTable = SCORE_LOOKUP[Math.min(behaviorSum, 40)] || 14;

        return { chartDataPoints, finalScore: scoreFromTable };
    };

    const finishAssessment = async (finalAnswersScores: Record<string, number>) => {
        setStep('processing');

        const formattedAnswers: AssessmentAnswer[] = Object.entries(finalAnswersScores).map(([key, score]) => {
            const q = FINANCIAL_QUESTIONS.find(q => q.id === key);
            const option = q?.options?.find(o => o.score === score);
            
            return {
                questionId: key,
                questionText: q?.text || '',
                value: option ? option.text : score.toString(),
                category: q?.category || 'general'
            };
        });

        const { finalScore } = calculateScore(finalAnswersScores);

        const newAssessment: Assessment = {
            id: Date.now().toString(),
            userId: user.id,
            date: new Date().toISOString(),
            answers: formattedAnswers,
            status: 'completed',
            r_calculated_score: finalScore
        };

        try {
            await storageService.saveAssessment(user.id, newAssessment);
            setAssessmentResult(newAssessment);
            setStep('result');
        } catch (error) {
            console.error(error);
            alert("Erro ao salvar resultado.");
            setStep('intro');
        }
    };

    const renderIntro = () => (
        <div className="max-w-3xl mx-auto text-center space-y-8 py-10 animate-fade-in">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 w-24 h-24 mx-auto rounded-full flex items-center justify-center shadow-xl mb-6">
                <ChartBarIcon className="h-12 w-12 text-white" />
            </div>
            
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white font-display">
                Descubra seu Perfil Financeiro
            </h2>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Faça nossa avaliação completa de saúde financeira baseada na tabela de score de comportamento. 
                Entenda seus hábitos, conhecimentos e atitudes em relação ao dinheiro.
            </p>

            {assessmentResult && (
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg inline-block border border-green-200 dark:border-green-800">
                    <p className="text-green-800 dark:text-green-300 font-medium flex items-center justify-center">
                        <CheckCircleIcon className="h-5 w-5 mr-2" />
                        Última avaliação: {assessmentResult.r_calculated_score} pontos em {new Date(assessmentResult.date).toLocaleDateString()}.
                    </p>
                </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                <button 
                    onClick={handleStart}
                    className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-blue-500/30 transition-all flex items-center"
                >
                    <PlayIcon className="h-6 w-6 mr-2" />
                    {assessmentResult ? 'Refazer Avaliação' : 'Iniciar Agora'}
                </button>
                
                {assessmentResult && (
                    <button 
                        onClick={() => setStep('result')}
                        className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-xl font-bold text-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                    >
                        Ver Último Resultado
                    </button>
                )}
            </div>
        </div>
    );

    const renderQuiz = () => {
        const question = FINANCIAL_QUESTIONS[currentQuestionIndex];
        const progress = ((currentQuestionIndex + 1) / FINANCIAL_QUESTIONS.length) * 100;

        return (
            <div className="max-w-2xl mx-auto py-6 animate-fade-in">
                <div className="mb-8">
                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium">
                        <span>Questão {currentQuestionIndex + 1} de {FINANCIAL_QUESTIONS.length}</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-blue-600 transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
                    {question.introTitle && (
                        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                            <h4 className="text-blue-800 dark:text-blue-300 font-bold uppercase text-xs tracking-wider mb-1">
                                {question.introTitle}
                            </h4>
                            <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-line">
                                {question.introText}
                            </p>
                        </div>
                    )}

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-8 leading-snug">
                        {question.text}
                    </h3>

                    <div className="space-y-3">
                        {question.options?.map((opt, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleAnswer(idx)} 
                                className="w-full text-left p-4 rounded-xl border-2 border-gray-100 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"
                            >
                                <div className="flex items-center">
                                    <div className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600 mr-4 group-hover:border-blue-500 flex items-center justify-center">
                                        <div className="w-3 h-3 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <span className="text-gray-700 dark:text-gray-200 font-medium">{opt.text}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-6 flex justify-between">
                    <button 
                        onClick={handlePrevious}
                        disabled={currentQuestionIndex === 0}
                        className="px-4 py-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white disabled:opacity-30 font-medium flex items-center"
                    >
                        <ArrowLeftIcon className="h-4 w-4 mr-2" />
                        Anterior
                    </button>
                    <button 
                        onClick={() => setStep('intro')}
                        className="px-4 py-2 text-red-500 hover:text-red-700 text-sm"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        );
    };

    const getQuestionScore = (questionId: string, answersList: AssessmentAnswer[]): number => {
        const ans = answersList.find(a => a.questionId === questionId);
        if (!ans) return 0;
        const q = FINANCIAL_QUESTIONS.find(quest => quest.id === questionId);
        if (!q || !q.options) return 0;
        
        const option = q.options.find(o => 
            o.text === ans.value || 
            o.score.toString() === ans.value.toString()
        );
        if (option) return option.score;
        
        const parsed = typeof ans.value === 'number' ? ans.value : parseInt(ans.value);
        if (!isNaN(parsed)) return parsed;
        
        return 0;
    };

    const renderResult = () => {
        const score = assessmentResult?.r_calculated_score || 14;
        
        let classification = "Saúde Financeira Inicial (Baixa)";
        let color = "text-orange-500 dark:text-orange-400";
        let gaugeColor = "rgba(249, 115, 22, 1)";
        let description = "Seu índice aponta os primeiros sinais de desequilíbrio e risco de estresse financeiro. Conforme o referencial de diagnóstico do Banco Central, este é um momento acolhedor para estruturar as contas básicas, recuperar o oxigênio mensal e restabelecer sua tranquilidade.";

        if (score >= 83) {
            classification = "Saúde Financeira Ótima";
            color = "text-emerald-500 dark:text-emerald-400";
            gaugeColor = "rgba(16, 185, 129, 1)";
            description = "Parabéns! Sua pontuação indica uma caminhada de excelência: vida financeira sem estresse, onde suas finanças proporcionam segurança ativa e ampla liberdade de escolha para o amanhã.";
        } else if (score >= 69) {
            classification = "Saúde Financeira Muito Boa";
            color = "text-emerald-600 dark:text-emerald-500";
            gaugeColor = "rgba(16, 185, 129, 0.8)";
            description = "Excelente controle do orçamento diário. De acordo com as diretrizes do Caderno de Educação Financeira do Banco Central, o seu próximo passo estratégico é consolidar a transição profissional para a construção de patrimônio e investimentos consistentes.";
        } else if (score >= 61) {
            classification = "Saúde Financeira Boa";
            color = "text-blue-500 dark:text-blue-400";
            gaugeColor = "rgba(59, 130, 246, 1)";
            description = "Você realiza o básico muito bem feito! Suas contas correntes e rotinas gerais estão estruturadas, havendo um ótimo ponto de partida para incrementar suas reservas de segurança mensais.";
        } else if (score >= 57) {
            classification = "Saúde Financeira Ok";
            color = "text-yellow-500 dark:text-yellow-400";
            gaugeColor = "rgba(234, 179, 8, 1)";
            description = "Seu equilíbrio de contas atualmente está no limite, com pouco espaço para imprevistos. O diagnóstico literário I-SFB sugere o fortalecimento imediato de rotinas protetivas para blindar seu orçamento de pequenas eventualidades.";
        } else if (score >= 50) {
            classification = "Saúde Financeira Inicial (Baixa)";
            color = "text-orange-500 dark:text-orange-400";
            gaugeColor = "rgba(249, 115, 22, 1)";
            description = "Seu índice aponta os primeiros sinais de desequilíbrio e risco de estresse financeiro. Conforme o referencial de diagnóstico do Banco Central, este é um momento acolhedor para estruturar as contas básicas, recuperar o oxigênio mensal e restabelecer sua tranquilidade.";
        } else if (score >= 37) {
            classification = "Saúde Financeira sob Atenção (Muito Baixa)";
            color = "text-rose-500 dark:text-rose-400";
            gaugeColor = "rgba(244, 63, 94, 0.85)";
            description = "Há indicação de risco de atingir uma situação financeira crítica. Sob as recomendações de saúde e cidadania financeira de FEBRABAN e Banco Central, sugere-se a suspensão de novos parcelamentos e o mapeamento conjunto de acordos protetivos.";
        } else {
            classification = "Saúde Financeira em Reestruturação (Ruim)";
            color = "text-rose-600 dark:text-rose-500";
            gaugeColor = "rgba(244, 63, 94, 1)";
            description = "Seu momento atual reflete um círculo de fragilidade, estresse e desorganização financeira. Mas lembre-se: trata-se apenas de um reflexo de comportamento dinâmico. O Caderno do Banco Central orienta que o foco principal agora é o estancamento de despesas não essenciais e suporte de renegociação.";
        }

        const answersList = assessmentResult?.answers || [];
        
        // Ponchio Autocontrol Category (CSSC: Q17-Q20)
        const scoreQ17 = getQuestionScore('Q17', answersList) || 3;
        const scoreQ18 = getQuestionScore('Q18', answersList) || 3;
        const scoreQ19 = getQuestionScore('Q19', answersList) || 3;
        const scoreQ20 = getQuestionScore('Q20', answersList) || 3;
        const meanCSSC = (scoreQ17 + scoreQ18 + scoreQ19 + scoreQ20) / 4;

        // Muehlbacher Mental Accounting Category (MA: Q21-Q25)
        const scoreQ21 = getQuestionScore('Q21', answersList) || 3;
        const scoreQ22 = getQuestionScore('Q22', answersList) || 3;
        const scoreQ23 = getQuestionScore('Q23', answersList) || 3;
        const scoreQ24 = getQuestionScore('Q24', answersList) || 3;
        const scoreQ25 = getQuestionScore('Q25', answersList) || 3;
        const meanMentalAccounting = (scoreQ21 + scoreQ22 + scoreQ23 + scoreQ24 + scoreQ25) / 5;

        let selfControlClass = "Moderado";
        let selfControlColor = "text-yellow-500 dark:text-yellow-400";
        let selfControlBg = "bg-yellow-500/10";
        let selfControlText = "Nível moderado de autocontrole de gastos. Segundo as diretrizes de comportamento do consumidor da pesquisa de Ponchio, você consegue manter um bom planejamento de curto prazo, mas pode encontrar oportunidades de fortalecimento ao lidar com gatilhos de consumo cotidianos.";
        
        if (meanCSSC >= 4.0) {
            selfControlClass = "Sólido e Consciente";
            selfControlColor = "text-emerald-500 dark:text-emerald-400";
            selfControlBg = "bg-emerald-500/10";
            selfControlText = "Excelente nível de autocontrole de gastos. Conforme apontado na literatura científica de Ponchio, você demonstra uma postura reflexiva em relação às suas compras, resistindo ativamente a apelos imediatos, o que promove uma redução expressiva no estresse financeiro diário.";
        } else if (meanCSSC < 3.0) {
            selfControlClass = "A Ser Desenvolvido";
            selfControlColor = "text-rose-500 dark:text-rose-400";
            selfControlBg = "bg-rose-500/10";
            selfControlText = "Seu autocontrole de gastos está em fase de desenvolvimento. A literatura acadêmica recomenda o fortalecimento de pequenas rotinas de parada e reflexão antes de compras por impulso, atenuando a fricção e as preocupações com o orçamento.";
        }

        let mentalAccountingClass = "Parcial e Adaptativa";
        let mentalAccountingColor = "text-yellow-500 dark:text-yellow-400";
        let mentalAccountingBg = "bg-yellow-500/10";
        let mentalAccountingText = "Sua prática de contabilidade mental segue um formato flexível. Os conceitos de Mauehlbacher indicam que você possui noção clara das suas principais despesas, mas pode aprimorar sua organização ao padronizar a separação de orçamentos específicos.";
        
        if (meanMentalAccounting >= 4.0) {
            mentalAccountingClass = "Estruturada e Precisa";
            mentalAccountingColor = "text-indigo-500 dark:text-indigo-400";
            mentalAccountingBg = "bg-indigo-500/10";
            mentalAccountingText = "Sua contabilidade mental é altamente estruturada. Em conformidade com o referencial teórico de Mauehlbacher e Kirchler, categorizar minuciosamente seus fluxos e limitar despesas conforme divisões prévias operam como um excelente pilar de autodisciplina e harmonia orçamentária.";
        } else if (meanMentalAccounting < 3.0) {
            mentalAccountingClass = "Incipiente ou Espontânea";
            mentalAccountingColor = "text-orange-500 dark:text-orange-400";
            mentalAccountingBg = "bg-orange-500/10";
            mentalAccountingText = "Sua contabilidade mental encontra-se em estágio inicial. A literatura científica sugere que a separação sistemática de verbas e o acompanhamento intencional das categorias de uso evitam falsas impressões de liquidez e fortalecem o equilíbrio orçamentário.";
        }

        // 1. Autocontrole strings based on Ponchio + BCB Mod 4
        let recAutocontrole = "";
        if (meanCSSC >= 4.0) {
            recAutocontrole = "Seu foco de consumo é exemplar. O Módulo 4 do Caderno de Educação Financeira do Banco Central sugere capitalizar esse comportamento protegendo-se dos gatilhos sutis da internet, como as assinaturas e serviços de uso adormecido ou compras recorrentes em aplicativos de entrega.";
        } else if (meanCSSC >= 3.0) {
            recAutocontrole = "Você possui boa estabilidade. Para mitigar impulsos imediatistas cotidianos, adote a regra do adiamento voluntário por 24 horas antes de concluir compras supérfluas (Módulo 1, pág. 21). Isso dá tempo para a razão equilibrar os gatilhos emocionais da tentação imediata.";
        } else {
            recAutocontrole = "Seu autocontrole de gastos está em fase de fortalecimento. O Módulo 4 do BCB (pág. 57) orienta planejar as despesas no papel e evitar ir ao supermercado com o estômago vazio (pois pesquisas mostram que isso induz o estresse e compras impulsivas severas).";
        }

        // 2. Contabilidade mental based on Muehlbacher + BCB Mod 2
        let recOrçamento = "";
        if (meanMentalAccounting >= 4.0) {
            recOrçamento = "Sua organização orçamentária é de alto nível. Conforme o Módulo 2 do Banco Central (pág. 26-29), refine suas Etapas e passe a debater o orçamento e metas de longo prazo em parceria dialogada e democrática com a sua família.";
        } else if (meanMentalAccounting >= 3.0) {
            recOrçamento = "Você possui consistência parcial relevante. Busque aplicar ativamente as 4 Etapas da literatura do BCB: Planejamento (estimativa), Registro Diário (anotando até os menores gastos), Agrupamento por categorias limítrofes e Avaliação Mensal de desvios (pág. 26).";
        } else {
            recOrçamento = "Sua contabilidade orçamentária requer dedicação básica inicial. O Módulo 2 do BCB (pág. 24, 30) destaca que ter controle simples de entradas e saídas evita a falsa percepção de liquidez e garante que as despesas do período fiquem sob a regra de ouro: abaixo das receitas.";
        }

        // 3. Juros e Crédito based on BCB Mod 3
        let recCredito = "A Cidadania Financeira desmitifica os juros compostos: use-os a seu favor na poupança e previna-os no crédito. Antes de optar por cartão ou empréstimo para cobrir as contas, busque sempre comparar o Custo Efetivo Total (CET), que traz todos os custos ocultos, em vez de apenas avaliar se a prestação cabe no bolso temporariamente (Módulo 3, pág. 37, 46).";

        // 4. Poupança e Futuro based on BCB Mod 5 & 6
        let recPoupança = "Como diretriz máxima de proteção de futuro e investimento do Banco Central (Módulo 5 e 6, pág. 28, 60), use rigorosamente o método de 'pagar-se primeiro': reserve a parcela dos seus planos prioritários e aposentadoria imediatamente ao receber seus rendimentos, aplicando-os antes de iniciar as demais saídas operacionais.";

        return (
            <div className="max-w-5xl mx-auto py-6 animate-fade-in relative z-10">
                <div className="text-center mb-10 px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white font-display mb-2">Seu Relatório de Comportamento</h2>
                    <p className="text-gray-500 text-sm md:text-base">Análise realizada em {new Date().toLocaleDateString()}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch px-4">
                    {/* Gauge Card */}
                    <div className="lg:col-span-5 bg-[#111827] dark:bg-gray-800 p-8 md:p-10 rounded-[2.5rem] shadow-2xl flex flex-col items-center justify-center text-center border border-white/5 h-full">
                        <h3 className="text-gray-400 font-bold uppercase tracking-widest text-[10px] md:text-xs mb-8 md:mb-12">Score de Comportamento</h3>
                        
                        <div className="relative mb-8 md:mb-12 flex items-center justify-center w-full">
                            <svg className="w-48 h-48 md:w-64 md:h-64 transform -rotate-90 block" viewBox="0 0 192 192">
                                <circle cx="96" cy="96" r="86" stroke="rgba(255,255,255,0.05)" strokeWidth="16" fill="transparent" />
                                <circle 
                                    cx="96" 
                                    cy="96" 
                                    r="86" 
                                    stroke={gaugeColor} 
                                    strokeWidth="16" 
                                    fill="transparent" 
                                    strokeDasharray={540} 
                                    strokeDashoffset={540 - (540 * score) / 100} 
                                    strokeLinecap="round" 
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center flex-col">
                                <span className="text-5xl md:text-7xl font-bold text-white tracking-tighter">{score}</span>
                                <span className="text-[10px] md:text-sm text-gray-400 font-medium mt-1">Pontos (I-SFB)</span>
                            </div>
                        </div>
                        
                        <h4 className={`text-xl md:text-2xl font-bold ${color} mb-4`}>{classification}</h4>
                        <p className="text-gray-300 text-xs md:text-sm leading-relaxed max-w-sm">{description}</p>
                    </div>

                    {/* Dimension Breakdown Card */}
                    <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
                        {/* Autocontrole Card */}
                        <div className="bg-[#111827] dark:bg-gray-800 p-6 md:p-8 rounded-[2rem] shadow-2xl border border-white/5 flex flex-col">
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`p-2 rounded-xl ${selfControlBg}`}>
                                    <ShieldCheckIcon className={`h-6 w-6 ${selfControlColor}`} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Autocontrole de Gastos (CSSC)</h3>
                                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-mono font-bold">Referência Científica: Ponchio et al. (2019)</p>
                                </div>
                            </div>

                            <div className="mt-2 flex items-baseline justify-between mb-2">
                                <span className={`text-xl font-bold ${selfControlColor}`}>Nível {selfControlClass}</span>
                                <span className="text-gray-300 font-mono text-sm">{meanCSSC.toFixed(1)} <span className="text-gray-500 text-xs">/ 5.0</span></span>
                            </div>

                            {/* Progress bar */}
                            <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden mb-4">
                                <div 
                                    className={`h-full rounded-full transition-all duration-1000 ${
                                        meanCSSC >= 4.0 ? 'bg-emerald-500' : meanCSSC >= 3.0 ? 'bg-yellow-500' : 'bg-rose-500'
                                    }`}
                                    style={{ width: `${(meanCSSC / 5) * 100}%` }}
                                />
                            </div>

                            <p className="text-xs text-gray-300 leading-relaxed font-sans">
                                {selfControlText}
                            </p>
                            
                            <p className="text-[10px] text-gray-400/60 mt-3 pt-2 border-t border-white/5 italic font-sans dark:text-gray-400/50">
                                * A pesquisa acadêmica nacional salienta que o autocontrole comportamental opera como o principal pilar de contenção de impulsos e proteção do bem-estar pessoal percebido.
                            </p>
                        </div>

                        {/* Contabilidade Mental Card */}
                        <div className="bg-[#111827] dark:bg-gray-800 p-6 md:p-8 rounded-[2rem] shadow-2xl border border-white/5 flex flex-col">
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`p-2 rounded-xl ${mentalAccountingBg}`}>
                                    <ClipboardDocumentCheckIcon className={`h-6 w-6 ${mentalAccountingColor}`} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Contabilidade Mental</h3>
                                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-mono font-bold">Referência Científica: Muehlbacher & Kirchler (2019)</p>
                                </div>
                            </div>

                            <div className="mt-2 flex items-baseline justify-between mb-2">
                                <span className={`text-xl font-bold ${mentalAccountingColor}`}>{mentalAccountingClass}</span>
                                <span className="text-gray-300 font-mono text-sm">{meanMentalAccounting.toFixed(1)} <span className="text-gray-500 text-xs">/ 5.0</span></span>
                            </div>

                            {/* Progress bar */}
                            <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden mb-4">
                                <div 
                                    className={`h-full rounded-full transition-all duration-1000 ${
                                        meanMentalAccounting >= 4.0 ? 'bg-indigo-500' : meanMentalAccounting >= 3.0 ? 'bg-yellow-500' : 'bg-orange-500'
                                    }`}
                                    style={{ width: `${(meanMentalAccounting / 5) * 100}%` }}
                                />
                            </div>

                            <p className="text-xs text-gray-300 leading-relaxed font-sans">
                                {mentalAccountingText}
                            </p>

                            <p className="text-[10px] text-gray-400/60 mt-3 pt-2 border-t border-white/5 italic font-sans dark:text-gray-400/50">
                                * Estudos de contabilidade mental sustentam que separar de forma sistemática orçamentos em contas mentais reduz a impulsividade de gastos imediatistas e melhora os resultados reais.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Recommendations Section */}
                <div className="mt-8 px-4">
                    <div className="bg-[#111827] dark:bg-gray-800 p-6 md:p-8 rounded-[2rem] shadow-2xl border border-white/5">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-amber-500/10 rounded-xl">
                                <LightBulbIcon className="h-6 w-6 text-amber-500" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white font-display">Caminhos de Recomendação Prática</h3>
                                <p className="text-[10px] text-gray-400 font-sans uppercase tracking-wider font-bold">Diretrizes Científicas extraídas do Caderno de Educação Financeira do Banco Central do Brasil</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Autocontrole */}
                            <div className="p-6 bg-white/5 rounded-2xl border border-white/5 flex flex-col justify-between">
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2 font-mono">1. Autocontrole e Consumo Consciente</h4>
                                    <p className="text-xs text-gray-300 leading-relaxed font-sans">{recAutocontrole}</p>
                                </div>
                                <div className="mt-4 pt-2 border-t border-white/5 flex items-center justify-between text-[9px] text-gray-500">
                                    <span>Tópico: Regulação Comportamental</span>
                                    <span className="font-mono">Fonte: Pesquisa Ponchio | Módulo 4 BCB</span>
                                </div>
                            </div>

                            {/* Contabilidade Mental */}
                            <div className="p-6 bg-white/5 rounded-2xl border border-white/5 flex flex-col justify-between">
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2 font-mono">2. Organização do Orçamento</h4>
                                    <p className="text-xs text-gray-300 leading-relaxed font-sans">{recOrçamento}</p>
                                </div>
                                <div className="mt-4 pt-2 border-t border-white/5 flex items-center justify-between text-[9px] text-gray-500">
                                    <span>Tópico: Planejamento Dinâmico</span>
                                    <span className="font-mono">Fonte: Muehlbacher Model | Módulo 2 BCB</span>
                                </div>
                            </div>

                            {/* Crédito e Juros (Mod 3 BCB) */}
                            <div className="p-6 bg-white/5 rounded-2xl border border-white/5 flex flex-col justify-between">
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-2 font-mono">3. Uso Consciente de Crédito & Juros</h4>
                                    <p className="text-xs text-gray-300 leading-relaxed font-sans">{recCredito}</p>
                                </div>
                                <div className="mt-4 pt-2 border-t border-white/5 flex items-center justify-between text-[9px] text-gray-500">
                                    <span>Tópico: Custo Efetivo Total</span>
                                    <span className="font-mono">Fonte: Caderno de Educação BCB (Módulo 3)</span>
                                </div>
                            </div>

                            {/* Poupança e Futuro (Mod 5 & 6 BCB) */}
                            <div className="p-6 bg-white/5 rounded-2xl border border-white/5 flex flex-col justify-between">
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 font-mono">4. Poupança Ativa e Aposentadoria</h4>
                                    <p className="text-xs text-gray-300 leading-relaxed font-sans">{recPoupança}</p>
                                </div>
                                <div className="mt-4 pt-2 border-t border-white/5 flex items-center justify-between text-[9px] text-gray-500">
                                    <span>Tópico: Cidadania Monetária</span>
                                    <span className="font-mono">Fonte: Caderno de Educação BCB (Módulo 5 e 6)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4 no-print px-4">
                    {onGoBack && (
                        <button onClick={onGoBack} className="flex items-center justify-center px-8 py-3.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all font-bold">
                            <HomeIcon className="h-5 w-5 mr-2" />
                            Voltar ao Painel
                        </button>
                    )}
                    <button onClick={handleStart} className="flex items-center justify-center px-8 py-3.5 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all font-bold shadow-xl shadow-blue-500/20">
                        <ArrowPathIcon className="h-5 w-5 mr-2" />
                        Refazer Teste
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-gray-50 dark:bg-[#030712] min-h-full w-full">
            {step === 'intro' && renderIntro()}
            {step === 'quiz' && renderQuiz()}
            {step === 'processing' && (
                <div className="flex flex-col items-center justify-center h-96 animate-pulse">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-500">Analisando seu perfil financeiro...</p>
                </div>
            )}
            {step === 'result' && renderResult()}
        </div>
    );
};

export default FinancialAssessment;
