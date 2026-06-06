import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  initializeFirestore, 
  persistentLocalCache
} from 'firebase/firestore';
import { 
  initializeAppCheck, 
  ReCaptchaV3Provider 
} from 'firebase/app-check';

// Função universal para ler variáveis de ambiente com qualquer prefixo
const getEnv = (key: string) => {
    const env = (import.meta as any).env;
    if (!env) return undefined;
    
    // Tenta todas as combinações possíveis
    return env[`VITE_${key}`] || 
           env[`FIREBASE_${key}`] || 
           env[`VITE_FIREBASE_${key}`] ||
           env[key];
};

let app;
let auth: any = undefined;
let db: any = undefined;
let isFirebaseActive = false;

try {
    // Tenta encontrar a chave de API de qualquer forma
    const apiKey = getEnv('API_KEY') || getEnv('FIREBASE_API_KEY');
    
    if (apiKey) {
        const firebaseConfig = {
            apiKey: apiKey,
            authDomain: getEnv('AUTH_DOMAIN') || getEnv('FIREBASE_AUTH_DOMAIN'),
            projectId: getEnv('PROJECT_ID') || getEnv('FIREBASE_PROJECT_ID'),
            storageBucket: getEnv('STORAGE_BUCKET') || getEnv('FIREBASE_STORAGE_BUCKET'),
            messagingSenderId: getEnv('MESSAGING_SENDER_ID') || getEnv('FIREBASE_MESSAGING_SENDER_ID'),
            appId: getEnv('APP_ID') || getEnv('FIREBASE_APP_ID')
        };

        console.log("[Firebase] Chave API encontrada. Inicializando...");
        
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        
        // Inicializa Firestore com cache persistente robusto
        try {
            db = initializeFirestore(app, {
                localCache: persistentLocalCache()
            });
            console.log("[Firebase] Firestore inicializado com Cache Persistente.");
        } catch (err) {
            console.warn("[Firebase] Falha ao ativar cache persistente (possível modo anônimo). Usando memória.", err);
            db = getFirestore(app);
        }

        // --- INICIALIZAÇÃO DO APP CHECK ---
        const recaptchaKey = getEnv('RECAPTCHA_SITE_KEY');
        
        if (recaptchaKey && typeof window !== 'undefined') {
            // Configuração para DEBUG LOCAL (localhost)
            // Isso permite testar o app localmente sem erros de App Check
            // O token será impresso no console. Copie e adicione no Firebase Console > App Check > Apps > Menu > Gerenciar Tokens de Depuração
            if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
                (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
                console.log("[App Check] Modo Debug ativado para localhost.");
            }

            try {
                initializeAppCheck(app, {
                    provider: new ReCaptchaV3Provider(recaptchaKey),
                    isTokenAutoRefreshEnabled: true
                });
                console.log("[App Check] Segurança ativada com reCAPTCHA v3.");
            } catch (e) {
                console.warn("[App Check] Falha ao inicializar:", e);
            }
        } else {
            console.log("[App Check] Chave reCAPTCHA não encontrada. Executando sem verificação de integridade.");
        }

        isFirebaseActive = true;
        console.log("[Firebase] Status: ONLINE");
    } else {
        console.warn("[Firebase] Nenhuma chave de API encontrada (VITE_*, FIREBASE_* ou *). App em Modo DEMO.");
    }
} catch (error) {
    console.error("[Firebase] Erro Fatal na inicialização:", error);
    auth = undefined;
    db = undefined;
    isFirebaseActive = false;
}

export { auth, db, isFirebaseActive };