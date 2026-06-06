
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
    HomeIcon
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

    const renderResult = () => {
        const score = assessmentResult?.r_calculated_score || 14;
        
        let classification = "Iniciante";
        let color = "text-orange-500";
        let gaugeColor = "rgba(249, 115, 22, 1)";
        let description = "Você está começando sua jornada. Focar em educação financeira básica ajudará a melhorar seu comportamento.";

        if (score >= 65) {
            classification = "Avançado";
            color = "text-emerald-500";
            gaugeColor = "rgba(16, 185, 129, 1)";
            description = "Excelente! Você demonstra ótimos hábitos e comportamento financeiro saudável.";
        } else if (score >= 45) {
            classification = "Intermediário";
            color = "text-blue-500";
            gaugeColor = "rgba(59, 130, 246, 1)";
            description = "Você está no caminho certo, mas ainda pode otimizar seu comportamento financeiro.";
        }

        return (
            <div className="max-w-4xl mx-auto py-6 animate-fade-in">
                <div className="text-center mb-10 px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white font-display mb-2">Seu Relatório de Comportamento</h2>
                    <p className="text-gray-500 text-sm md:text-base">Análise realizada em {new Date().toLocaleDateString()}</p>
                </div>

                <div className="max-w-md mx-auto px-4">
                    {/* Gauge Card */}
                    <div className="bg-[#111827] dark:bg-gray-800 p-8 md:p-10 rounded-[2.5rem] shadow-2xl flex flex-col items-center justify-center text-center border border-white/5 h-full">
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
                                    strokeDashoffset={540 - (540 * score) / 86} 
                                    strokeLinecap="round" 
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center flex-col">
                                <span className="text-5xl md:text-7xl font-bold text-white tracking-tighter">{score}</span>
                                <span className="text-[10px] md:text-sm text-gray-400 font-medium mt-1">Pontos</span>
                            </div>
                        </div>
                        
                        <h4 className={`text-2xl md:text-3xl font-bold ${color} mb-4`}>{classification}</h4>
                        <p className="text-gray-300 text-xs md:text-sm leading-relaxed max-w-xs">{description}</p>
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
