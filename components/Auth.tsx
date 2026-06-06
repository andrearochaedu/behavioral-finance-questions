import React, { useState } from 'react';
import { storageService } from '../services/storageService';
import { User } from '../types';
import { 
    UserIcon, 
    LockClosedIcon, 
    EnvelopeIcon, 
    ArrowLeftIcon, 
    CheckCircleIcon, 
    ExclamationTriangleIcon,
    EyeIcon,
    EyeSlashIcon
} from '@heroicons/react/24/outline';

interface AuthProps {
    onLoginSuccess: (user: User) => void;
}

type AuthView = 'LOGIN' | 'REGISTER' | 'FORGOT_PASSWORD' | 'RESET_PASSWORD';

// --- UI COMPONENTS (NeoFinance Style) ---
// MOVED OUTSIDE to prevent re-rendering focus loss issues
const InputField = ({ 
    label, 
    type, 
    value, 
    onChange, 
    icon: Icon, 
    placeholder, 
    required = true 
}: any) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const isPasswordType = type === 'password';
    const inputType = isPasswordType ? (isPasswordVisible ? 'text' : 'password') : type;

    return (
        <div className="group">
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 ml-1 font-sans">
                {label}
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Icon className="h-5 w-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors duration-300" />
                </div>
                <input
                    type={inputType}
                    required={required}
                    value={value}
                    onChange={onChange}
                    className="block w-full pl-11 pr-12 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300 hover:bg-black/30 backdrop-blur-sm font-sans"
                    placeholder={placeholder}
                />
                {isPasswordType && (
                    <button
                        type="button"
                        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-cyan-400 transition-colors duration-300 focus:outline-none"
                    >
                        {isPasswordVisible ? (
                            <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                            <EyeIcon className="h-5 w-5" />
                        )}
                    </button>
                )}
            </div>
        </div>
    );
};

const PrimaryButton = ({ children, onClick, disabled }: any) => (
    <button
        onClick={onClick}
        disabled={disabled}
        type="submit"
        className="w-full flex items-center justify-center py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold font-sans rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
    >
        {disabled ? (
            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
            children
        )}
    </button>
);

const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
    const [view, setView] = useState<AuthView>('LOGIN');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Form States
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // Recovery States
    const [resetCode, setResetCode] = useState('');

    const resetForm = () => {
        setError('');
        setSuccessMsg('');
        setName('');
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setResetCode('');
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const user = await storageService.login(username, password);
            onLoginSuccess(user);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            if (password !== confirmPassword) throw new Error('As senhas não coincidem.');
            if (password.length < 6) throw new Error('A senha deve ter pelo menos 6 caracteres para sua segurança.');
            if (!email.includes('@')) throw new Error('Informe um e-mail válido.');
            
            const user = await storageService.register(name, username, email, password);
            onLoginSuccess(user);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRequestReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        setIsLoading(true);
        try {
            if (!email) throw new Error("Informe seu e-mail.");
            const result = await storageService.requestPasswordReset(email);
            
            if (result === 'EMAIL_SENT') {
                setSuccessMsg(`Link de recuperação enviado para ${email}.`);
                alert(`Um link de redefinição de senha foi enviado para o e-mail ${email}.`);
                setView('LOGIN');
            } else {
                setSuccessMsg('Código de recuperação enviado (simulação).');
                setView('RESET_PASSWORD');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirmReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            if (password !== confirmPassword) throw new Error('As senhas não coincidem.');
            if (password.length < 6) throw new Error('A senha deve ter pelo menos 6 caracteres.');
            
            await storageService.verifyResetCodeAndChangePassword(email, resetCode, password);
            alert('Senha alterada com sucesso!');
            setView('LOGIN');
            resetForm();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#030712] relative overflow-hidden font-sans text-slate-200">
            
            {/* --- BACKGROUND EFFECTS (Futuristic Glows) --- */}
            <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-600/10 blur-[100px]" />
            <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] rounded-full bg-purple-600/10 blur-[80px]" />
            
            {/* Noise Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJnoiPjxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjY1IiBudW1PY3RhdmVzPSIzIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2cpIiBvcGFjaXR5PSIwLjUiLz48L3N2Zz4=')]"></div>

            {/* --- GLASS CARD --- */}
            <div className="relative z-10 w-full max-w-md p-4">
                {/* Borda brilhante superior */}
                <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
                
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 relative overflow-hidden ring-1 ring-white/5">
                    
                    {/* Reflexo sutil */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                    {/* --- HEADER --- */}
                    <div className="text-center mb-8 relative z-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 via-indigo-500 to-purple-600 mb-5 shadow-lg shadow-indigo-500/30 transform rotate-3 hover:rotate-6 transition-transform duration-500">
                            <svg className="w-8 h-8 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-white font-display mb-2 leading-tight">
                            Diagnóstico de Bem-Estar Financeiro
                        </h1>
                        <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">
                            Cooperativa de Crédito · Centro-Oeste de Minas Gerais
                        </p>
                    </div>

                    {/* --- ALERTS --- */}
                    {error && (
                        <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 relative z-10 backdrop-blur-md animate-fade-in">
                            <ExclamationTriangleIcon className="h-5 w-5 text-red-400 shrink-0" />
                            <p className="text-red-200 text-sm">{error}</p>
                        </div>
                    )}
                    {successMsg && (
                        <div className="mb-6 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-3 relative z-10 backdrop-blur-md animate-fade-in">
                            <CheckCircleIcon className="h-5 w-5 text-emerald-400 shrink-0" />
                            <p className="text-emerald-200 text-sm">{successMsg}</p>
                        </div>
                    )}

                    {/* --- VIEW: LOGIN --- */}
                    {view === 'LOGIN' && (
                        <form onSubmit={handleLogin} className="space-y-5 relative z-10">
                            <InputField 
                                label="Usuário ou E-mail"
                                type="text"
                                value={username}
                                onChange={(e: any) => setUsername(e.target.value)}
                                icon={UserIcon}
                                placeholder="seu.usuario"
                            />
                            <div className="space-y-1">
                                <InputField 
                                    label="Senha"
                                    type="password"
                                    value={password}
                                    onChange={(e: any) => setPassword(e.target.value)}
                                    icon={LockClosedIcon}
                                    placeholder="••••••••"
                                />
                                <div className="flex justify-end">
                                    <button 
                                        type="button" 
                                        onClick={() => { resetForm(); setView('FORGOT_PASSWORD'); }}
                                        className="text-xs text-slate-400 hover:text-cyan-400 transition-colors duration-200 mt-1 font-medium"
                                    >
                                        Esqueci minha senha
                                    </button>
                                </div>
                            </div>
                            
                            <PrimaryButton disabled={isLoading}>
                                Acessar Conta
                            </PrimaryButton>

                            <div className="mt-6 text-center">
                                <p className="text-sm text-slate-400">
                                    Ainda não tem acesso?{' '}
                                    <button 
                                        type="button"
                                        onClick={() => { resetForm(); setView('REGISTER'); }}
                                        className="text-white font-semibold hover:text-cyan-400 transition-colors duration-200 ml-1 relative group"
                                    >
                                        Criar conta
                                        <span className="absolute bottom-0 left-0 w-0 h-px bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
                                    </button>
                                </p>
                            </div>
                        </form>
                    )}

                    {/* --- VIEW: REGISTER --- */}
                    {view === 'REGISTER' && (
                        <form onSubmit={handleRegister} className="space-y-5 relative z-10 animate-fade-in-up">
                            <button 
                                type="button" 
                                onClick={() => setView('LOGIN')}
                                className="flex items-center text-xs text-slate-400 hover:text-white transition-colors mb-2"
                            >
                                <ArrowLeftIcon className="h-3 w-3 mr-1"/> Voltar ao login
                            </button>
                            
                            <InputField 
                                label="Nome Completo"
                                type="text"
                                value={name}
                                onChange={(e: any) => setName(e.target.value)}
                                icon={UserIcon}
                                placeholder="Seu nome"
                            />
                            
                            {/* Layout Alterado: Itens empilhados verticalmente em vez de grid */}
                            <InputField 
                                label="Usuário"
                                type="text"
                                value={username}
                                onChange={(e: any) => setUsername(e.target.value)}
                                icon={UserIcon}
                                placeholder="user123"
                            />
                            <InputField 
                                label="E-mail"
                                type="email"
                                value={email}
                                onChange={(e: any) => setEmail(e.target.value)}
                                icon={EnvelopeIcon}
                                placeholder="email@"
                            />
                            
                            <InputField 
                                label="Senha"
                                type="password"
                                value={password}
                                onChange={(e: any) => setPassword(e.target.value)}
                                icon={LockClosedIcon}
                                placeholder="Criar senha (min 6 chars)"
                            />
                            <InputField 
                                label="Confirmar"
                                type="password"
                                value={confirmPassword}
                                onChange={(e: any) => setConfirmPassword(e.target.value)}
                                icon={LockClosedIcon}
                                placeholder="Repetir senha"
                            />

                            <PrimaryButton disabled={isLoading}>
                                Criar Conta Grátis
                            </PrimaryButton>
                        </form>
                    )}

                    {/* --- VIEW: FORGOT PASSWORD --- */}
                    {view === 'FORGOT_PASSWORD' && (
                        <form onSubmit={handleRequestReset} className="space-y-6 relative z-10 animate-fade-in-up">
                            <button 
                                type="button" 
                                onClick={() => setView('LOGIN')}
                                className="flex items-center text-xs text-slate-400 hover:text-white transition-colors mb-2"
                            >
                                <ArrowLeftIcon className="h-3 w-3 mr-1"/> Voltar
                            </button>

                            <div className="text-center">
                                <h3 className="text-xl font-bold text-white font-display">Recuperar Acesso</h3>
                                <p className="text-sm text-slate-400 mt-1">Enviaremos as instruções para seu e-mail.</p>
                            </div>

                            <InputField 
                                label="E-mail Cadastrado"
                                type="email"
                                value={email}
                                onChange={(e: any) => setEmail(e.target.value)}
                                icon={EnvelopeIcon}
                                placeholder="seu@email.com"
                            />

                            <PrimaryButton disabled={isLoading}>
                                Enviar Link
                            </PrimaryButton>
                        </form>
                    )}

                    {/* --- VIEW: RESET PASSWORD (LOCAL DEMO) --- */}
                    {view === 'RESET_PASSWORD' && (
                        <form onSubmit={handleConfirmReset} className="space-y-5 relative z-10 animate-fade-in-up">
                            <div className="text-center mb-4">
                                <span className="bg-yellow-500/20 text-yellow-200 text-xs font-bold px-2 py-1 rounded border border-yellow-500/30">MODO DEMO LOCAL</span>
                                <h3 className="text-lg font-bold text-white mt-2">Confirmar Código</h3>
                            </div>

                            <div className="group">
                                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 ml-1">Código de 6 Dígitos</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={resetCode} 
                                    onChange={(e) => setResetCode(e.target.value)} 
                                    className="block w-full px-4 py-3 bg-black/30 border border-cyan-500/50 rounded-xl text-white text-center tracking-[0.5em] font-mono text-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                                    placeholder="000000" 
                                    maxLength={6} 
                                />
                            </div>

                            <InputField 
                                label="Nova Senha"
                                type="password"
                                value={password}
                                onChange={(e: any) => setPassword(e.target.value)}
                                icon={LockClosedIcon}
                                placeholder="Nova senha (min 6 chars)"
                            />
                            <InputField 
                                label="Confirmar"
                                type="password"
                                value={confirmPassword}
                                onChange={(e: any) => setConfirmPassword(e.target.value)}
                                icon={LockClosedIcon}
                                placeholder="Repetir senha"
                            />

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all"
                            >
                                {isLoading ? 'Processando...' : 'Alterar Senha'}
                            </button>
                        </form>
                    )}

                </div>
                
                {/* Glow de rodapé */}
                <div className="absolute -bottom-6 left-10 right-10 h-12 bg-indigo-500/20 blur-xl rounded-full -z-10" />
            </div>
        </div>
    );
};

export default Auth;
