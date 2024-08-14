declare global {
    namespace NodeJS {
        interface ProcessEnv {
            VITE_GOOGLE_CLIENT_ID: string;
        }
    }
}
export {};