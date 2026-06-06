
// Simulação de Criptografia AES (Client-Side)
// Nota: Em produção real (Firebase), a segurança principal vem do HTTPS + RLS.
// Esta camada é para o fallback local.

export const cryptoService = {
    encrypt: (data: any): string => {
        try {
            const jsonString = JSON.stringify(data);
            return btoa(encodeURIComponent(jsonString));
        } catch (e) {
            console.error("Error encrypting data", e);
            return "";
        }
    },

    decrypt: <T>(cipherText: string | null): T | null => {
        if (!cipherText) return null;
        try {
            const jsonString = decodeURIComponent(atob(cipherText));
            return JSON.parse(jsonString) as T;
        } catch (e) {
            console.error("Error decrypting data", e);
            return null;
        }
    }
};
