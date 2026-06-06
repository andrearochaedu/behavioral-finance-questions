import { User, Transaction, Settings, Assessment } from '../types';
import { cryptoService } from './cryptoService';
import { auth, db, isFirebaseActive } from './firebase';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    updateProfile, 
    updatePassword,
    sendPasswordResetEmail,
    onAuthStateChanged,
    signOut,
    deleteUser,
    reauthenticateWithCredential,
    EmailAuthProvider
} from 'firebase/auth';
import { 
    doc, 
    getDoc, 
    setDoc, 
    collection, 
    query, 
    where, 
    getDocs,
    deleteDoc,
    addDoc,
    orderBy,
    limit
} from 'firebase/firestore';

const DB_PREFIX = 'finedu_secure_db_';
const USERS_KEY = 'finedu_users_index';
const SESSION_KEY = 'finedu_session_user'; 

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const cleanTransaction = (t: Transaction) => {
    return {
        id: t.id,
        type: t.type,
        description: t.description || '',
        amount: Number(t.amount) || 0,
        date: t.date,
        category: t.category,
        subcategory: t.subcategory || null, 
        paymentMethod: t.paymentMethod || null,
        recurrence: t.recurrence,
        recurrenceCount: t.recurrenceCount || null
    };
};

export const storageService = {
    
    getConnectionStatus: () => isFirebaseActive ? 'ONLINE' : 'OFFLINE',

    observeSession: (callback: (user: User | null) => void) => {
        if (isFirebaseActive && auth) {
            onAuthStateChanged(auth, async (firebaseUser) => {
                if (firebaseUser) {
                    try {
                        let profileData = { name: firebaseUser.displayName || 'Usuário', username: 'user' };
                        if (db) {
                            const docRef = doc(db, "userdata", firebaseUser.uid);
                            const docSnap = await getDoc(docRef);
                            if (docSnap.exists() && docSnap.data().profile) {
                                profileData = docSnap.data().profile;
                            }
                        }
                        callback({
                            id: firebaseUser.uid,
                            email: firebaseUser.email || '',
                            name: profileData.name,
                            username: profileData.username,
                            password: '***'
                        });
                    } catch (e) {
                        console.error("Erro ao restaurar perfil Firebase", e);
                        callback(null);
                    }
                } else {
                    callback(null);
                }
            });
        } else {
            const savedUserId = localStorage.getItem(SESSION_KEY);
            if (savedUserId) {
                storageService._getLocalUsers().then(users => {
                    const user = users.find(u => u.id === savedUserId);
                    callback(user || null);
                });
            } else {
                callback(null);
            }
        }
    },

    async logout(): Promise<void> {
        if (isFirebaseActive && auth) {
            await signOut(auth);
        }
        localStorage.removeItem(SESSION_KEY);
    },

    async login(identifier: string, password: string): Promise<User> {
        if (isFirebaseActive && auth && db) {
            try {
                let emailToUse = identifier;
                if (!identifier.includes('@')) {
                    const q = query(collection(db, "userdata"), where("profile.username", "==", identifier));
                    const querySnapshot = await getDocs(q);
                    if (querySnapshot.empty) throw new Error("Usuário não encontrado.");
                    const docData = querySnapshot.docs[0].data();
                    if (docData.profile && docData.profile.email) {
                        emailToUse = docData.profile.email;
                    }
                }
                const userCredential = await signInWithEmailAndPassword(auth, emailToUse, password);
                const firebaseUser = userCredential.user;
                
                const docRef = doc(db, "userdata", firebaseUser.uid);
                const docSnap = await getDoc(docRef);
                
                let profileData = { name: firebaseUser.displayName || 'Usuário', username: 'user' };
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (data.profile) profileData = data.profile;
                }
                return {
                    id: firebaseUser.uid,
                    email: firebaseUser.email || '',
                    name: profileData.name,
                    username: profileData.username,
                    password: '***'
                };
            } catch (error: any) {
                console.error("Erro Login Firebase:", error);
                throw new Error('Usuário ou senha incorretos.');
            }
        }
        await delay(600);
        const users = await this._getLocalUsers();
        const user = users.find(u => (u.username === identifier || u.email === identifier) && u.password === password);
        if (!user) throw new Error('Usuário/E-mail ou senha inválidos (Modo Local).');
        localStorage.setItem(SESSION_KEY, user.id);
        return user;
    },

    async register(name: string, username: string, email: string, password: string): Promise<User> {
        if (isFirebaseActive && auth && db) {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const firebaseUser = userCredential.user;
                await updateProfile(firebaseUser, { displayName: name });
                const newUserProfile = { id: firebaseUser.uid, email: email, name: name, username: username };
                await setDoc(doc(db, "userdata", firebaseUser.uid), {
                    profile: newUserProfile,
                    transactions: [],
                    settings: { monthlySavingsGoal: 0, spendingLimits: {}, goals: [] }
                });
                return { ...newUserProfile, password: '***' };
            } catch (error: any) {
                if (error.code === 'auth/email-already-in-use') throw new Error('Este e-mail já está cadastrado.');
                throw error;
            }
        }
        await delay(800);
        const users = await this._getLocalUsers();
        if (users.some(u => u.username === username)) throw new Error('Este nome de usuário já está em uso.');
        if (users.some(u => u.email === email)) throw new Error('Este e-mail já está cadastrado.');
        const newUser: User = { id: Date.now().toString(), name, username, email, password };
        users.push(newUser);
        await this._saveLocalUsers(users);
        localStorage.setItem(SESSION_KEY, newUser.id);
        return newUser;
    },

    async updateUser(updatedUser: User, newPassword?: string): Promise<User> {
        if (isFirebaseActive && auth && db) {
            const currentUser = auth.currentUser;
            if (!currentUser) throw new Error("Sessão expirada.");
            const userRef = doc(db, "userdata", currentUser.uid);
            await setDoc(userRef, {
                profile: {
                    name: updatedUser.name,
                    username: updatedUser.username,
                    email: updatedUser.email
                }
            }, { merge: true });
            if (newPassword) await updatePassword(currentUser, newPassword);
            return updatedUser;
        }
        await delay(500);
        const users = await this._getLocalUsers();
        const index = users.findIndex(u => u.id === updatedUser.id);
        if (index === -1) throw new Error("Usuário não encontrado");
        if (newPassword) updatedUser.password = newPassword;
        users[index] = updatedUser;
        await this._saveLocalUsers(users);
        return updatedUser;
    },

    async deleteAccount(password: string): Promise<void> {
        if (isFirebaseActive && auth && db) {
            const user = auth.currentUser;
            if (!user) throw new Error("Usuário não autenticado.");
            if (!user.email) throw new Error("Usuário sem e-mail.");
            const credential = EmailAuthProvider.credential(user.email, password);
            try {
                await reauthenticateWithCredential(user, credential);
                await deleteDoc(doc(db, "userdata", user.uid));
                await deleteUser(user);
                return;
            } catch (error: any) {
                if (error.code === 'auth/wrong-password') throw new Error("Senha incorreta.");
                throw new Error("Falha ao excluir conta.");
            }
        }
        await delay(800);
        const savedId = localStorage.getItem(SESSION_KEY);
        if (!savedId) throw new Error("Sessão inválida.");
        let users = await this._getLocalUsers();
        const user = users.find(u => u.id === savedId);
        if (!user) throw new Error("Usuário não encontrado.");
        if (user.password !== password) throw new Error("Senha incorreta.");
        users = users.filter(u => u.id !== savedId);
        await this._saveLocalUsers(users);
        localStorage.removeItem(`${DB_PREFIX}${savedId}`);
        localStorage.removeItem(SESSION_KEY);
    },

    async requestPasswordReset(email: string): Promise<'EMAIL_SENT' | 'CODE_SENT'> {
        if (isFirebaseActive && auth) {
            try {
                await sendPasswordResetEmail(auth, email);
                return 'EMAIL_SENT';
            } catch (error: any) {
                return 'EMAIL_SENT'; 
            }
        }
        await delay(1000);
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        alert(`[SIMULAÇÃO LOCAL] Código: ${code}`);
        localStorage.setItem(`reset_code_${email}`, code);
        return 'CODE_SENT';
    },

    async verifyResetCodeAndChangePassword(email: string, code: string, newPassword: string): Promise<void> {
        if (isFirebaseActive) throw new Error("Em modo Online, use o link enviado por e-mail.");
        await delay(800);
        const savedCode = localStorage.getItem(`reset_code_${email}`);
        if (!savedCode || savedCode !== code) throw new Error("Código inválido.");
        const users = await this._getLocalUsers();
        const index = users.findIndex(u => u.email === email);
        if (index !== -1) {
            users[index].password = newPassword;
            await this._saveLocalUsers(users);
            localStorage.removeItem(`reset_code_${email}`);
        } else {
             throw new Error("Erro ao processar.");
        }
    },

    async getUserData(userId: string): Promise<{ transactions: Transaction[], settings: Settings }> {
        const defaultSettings = { monthlySavingsGoal: 0, spendingLimits: {}, goals: [] };
        
        if (isFirebaseActive && db) {
            try {
                const docRef = doc(db, "userdata", userId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    return {
                        transactions: data.transactions || [],
                        settings: { ...defaultSettings, ...(data.settings || {}) }
                    };
                } else {
                    return { transactions: [], settings: defaultSettings };
                }
            } catch (error: any) {
                console.error("Erro ao buscar dados Firebase:", error);
                throw error;
            }
        }
        const key = `${DB_PREFIX}${userId}`;
        const raw = localStorage.getItem(key);
        if (!raw) return { transactions: [], settings: defaultSettings };
        const data = cryptoService.decrypt<{ transactions: Transaction[], settings: Settings }>(raw) || { transactions: [], settings: defaultSettings };
        return {
            transactions: data.transactions || [],
            settings: { ...defaultSettings, ...(data.settings || {}) }
        };
    },

    async saveUserData(userId: string, transactions: Transaction[], settings: Settings): Promise<void> {
        const cleanTransactions = transactions.map(cleanTransaction);
        const cleanSettings = {
            monthlySavingsGoal: Number(settings.monthlySavingsGoal) || 0,
            spendingLimits: settings.spendingLimits || {},
            goals: settings.goals || [],
            monthlyBudgets: settings.monthlyBudgets || {}
        };

        if (isFirebaseActive && db) {
            try {
                const docRef = doc(db, "userdata", userId);
                const payload = { transactions: cleanTransactions, settings: cleanSettings };
                await setDoc(docRef, payload, { merge: true });
                return;
            } catch (error: any) {
                console.error("Erro CRÍTICO ao salvar no Firebase:", error);
                alert(`Erro ao salvar: ${error.message}`);
                throw error;
            }
        }
        const key = `${DB_PREFIX}${userId}`;
        const data = { transactions: cleanTransactions, settings: cleanSettings };
        const encrypted = cryptoService.encrypt(data);
        localStorage.setItem(key, encrypted);
    },

    async saveAssessment(userId: string, assessment: Assessment): Promise<void> {
        if (isFirebaseActive && db) {
            try {
                const questionnairesCollection = collection(db, "userdata", userId, "questionnaires");
                await addDoc(questionnairesCollection, assessment);
                return;
            } catch (error: any) {
                if (error.code === 'permission-denied') {
                    alert(`ERRO DE PERMISSÃO: O Firebase bloqueou a gravação.`);
                }
                throw error;
            }
        }

        const key = `${DB_PREFIX}${userId}_assessments`;
        const existing = localStorage.getItem(key);
        let assessments: Assessment[] = [];
        if (existing) {
             assessments = cryptoService.decrypt(existing) || [];
        }
        assessments.push(assessment);
        localStorage.setItem(key, cryptoService.encrypt(assessments));
    },

    async getLatestAssessment(userId: string): Promise<Assessment | null> {
        if (isFirebaseActive && db) {
            try {
                const questionnairesCollection = collection(db, "userdata", userId, "questionnaires");
                const q = query(questionnairesCollection, orderBy("date", "desc"), limit(1));
                const snapshot = await getDocs(q);
                
                if (!snapshot.empty) {
                    return snapshot.docs[0].data() as Assessment;
                }
                return null;
            } catch (error) {
                return null;
            }
        }

        const key = `${DB_PREFIX}${userId}_assessments`;
        const existing = localStorage.getItem(key);
        if (existing) {
            const assessments: Assessment[] = cryptoService.decrypt(existing) || [];
            if (assessments.length > 0) {
                return assessments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
            }
        }
        return null;
    },

    async _getLocalUsers(): Promise<User[]> {
        const encryptedUsers = localStorage.getItem(USERS_KEY);
        if (!encryptedUsers) return [];
        return cryptoService.decrypt<User[]>(encryptedUsers) || [];
    },

    async _saveLocalUsers(users: User[]): Promise<void> {
        const encryptedUsers = cryptoService.encrypt(users);
        localStorage.setItem(USERS_KEY, encryptedUsers);
    }
};