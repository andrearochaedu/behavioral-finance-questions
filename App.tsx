import React, { useState, useEffect } from 'react';
import { User, FontSize } from './types';
import Auth from './components/Auth';
import FinancialAssessment from './components/FinancialAssessment'; 
import { storageService } from './services/storageService';
import { 
    BanknotesIcon, 
    ArrowRightOnRectangleIcon,
    UserCircleIcon,
    SunIcon,
    MoonIcon
} from '@heroicons/react/24/outline';

type Theme = 'light' | 'dark';

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isRestoringSession, setIsRestoringSession] = useState(true);
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
            return localStorage.getItem('theme') as Theme;
        }
        if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'dark'; 
    });

    // Acessibilidade: Estado de Tamanho da Fonte (Padrão Small)
    const [fontSize, setFontSize] = useState<FontSize>(() => {
        if (typeof localStorage !== 'undefined' && localStorage.getItem('fontSize')) {
            return localStorage.getItem('fontSize') as FontSize;
        }
        return 'small';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Aplica o tamanho da fonte na raiz HTML
    useEffect(() => {
        const root = window.document.documentElement;
        let size = '16px'; // Padrão (Medium)
        
        if (fontSize === 'small') size = '14px';
        if (fontSize === 'large') size = '18px';
        
        root.style.fontSize = size;
        localStorage.setItem('fontSize', fontSize);
    }, [fontSize]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    useEffect(() => {
        storageService.observeSession((user) => {
            setCurrentUser(user);
            setIsRestoringSession(false);
        });
    }, []);

    if (isRestoringSession) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0b0c15]">
                <div className="flex flex-col items-center">
                    <div className="w-10 h-10 border-t-2 border-l-2 border-indigo-500 rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    if (!currentUser) {
        return (
            <>
                <Auth onLoginSuccess={(user) => setCurrentUser(user)} />
            </>
        ); 
    }

    return (
        <AuthenticatedApp 
            user={currentUser} 
            onLogout={() => { storageService.logout(); setCurrentUser(null); }} 
            theme={theme}
            toggleTheme={toggleTheme}
        />
    );
};

const AuthenticatedApp: React.FC<{ 
    user: User, 
    onLogout: () => void, 
    theme: Theme,
    toggleTheme: () => void
}> = ({ user, onLogout, theme, toggleTheme }) => {

    // AUTO LOGOUT LOGIC (30 Minutes Inactivity)
    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;
        const INACTIVITY_LIMIT = 30 * 60 * 1000; // 30 minutes

        const resetTimer = () => {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => {
                alert("Sessão expirada por inatividade (30 min).");
                onLogout();
            }, INACTIVITY_LIMIT);
        };

        const events = ['mousemove', 'keypress', 'click', 'scroll', 'touchstart'];
        events.forEach(event => window.addEventListener(event, resetTimer));
        
        resetTimer(); // Init timer

        return () => {
            if (timeout) clearTimeout(timeout);
            events.forEach(event => window.removeEventListener(event, resetTimer));
        };
    }, [onLogout]);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#0b0c15] text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
            
            {/* Background Mesh Gradient (Subtle) */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] dark:bg-indigo-500/10" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] dark:bg-purple-500/10" />
            </div>

            <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-[#0b0c15]/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/5 transition-all duration-300">
                <div className="flex justify-between items-center max-w-7xl mx-auto px-4 sm:px-6 py-3 w-full">
                     
                     {/* Logo */}
                     <div className="flex items-center gap-3">
                         <div className="bg-indigo-600 text-white p-1.5 rounded-lg shadow-md shadow-indigo-600/30">
                             <BanknotesIcon className="h-5 w-5" />
                         </div>
                         <h1 className="text-lg font-bold font-display tracking-tight text-gray-900 dark:text-white">FinEdu</h1>
                     </div>

                     {/* Profile Actions */}
                     <div className="flex items-center gap-3">
                         <button 
                             onClick={toggleTheme}
                             className="p-2 text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-white/5"
                             title={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
                         >
                             {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
                         </button>
                         <div className="h-4 w-px bg-gray-200 dark:bg-white/10"></div>
                         
                         <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
                             <UserCircleIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                             <span className="text-sm font-medium text-gray-700 dark:text-gray-200 max-w-[120px] truncate">
                                 {user.name.split(' ')[0]}
                             </span>
                         </div>
                         
                         <button 
                             onClick={onLogout}
                             className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                             title="Sair"
                         >
                             <ArrowRightOnRectangleIcon className="h-5 w-5" />
                         </button>
                     </div>
                </div>
            </header>

            {/* Content Area - ONLY FinancialAssessment questionnaire */}
            <main className="flex-1 relative z-10 px-4 sm:px-6 lg:px-8 pt-20 pb-12 max-w-7xl mx-auto w-full">
                <FinancialAssessment user={user} />
            </main>
        </div>
    );
};

export default App;