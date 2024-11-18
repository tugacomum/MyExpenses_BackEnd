declare global {
  namespace NodeJS {
    interface ProcessEnv {
      JWT_SECRET: string;
      EMAIL_SECRET: string;
      PASSWORD_SECRET: string;
    }
  }
};

export {};