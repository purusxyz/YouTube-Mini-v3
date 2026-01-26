import 'express';

declare module 'express' {
  interface Request {
    session?: {
      [key: string]: any;
    } | null; // ✅ allow null
  }
}
