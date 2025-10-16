import type { TFunction } from 'i18next';

declare global {
  namespace Express {
    interface Request {
      t: TFunction;
    }
  }
}

export {};
