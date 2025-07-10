export class ArchbaseError extends Error {
  public readonly code?: string;
  public readonly details?: unknown;
  public readonly timestamp: Date;

  constructor(message: string, code?: string, details?: unknown) {
    super(message);
    this.name = 'ArchbaseError';
    this.code = code;
    this.details = details;
    this.timestamp = new Date();
    
    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ArchbaseError);
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      details: this.details,
      timestamp: this.timestamp,
      stack: this.stack,
    };
  }
}