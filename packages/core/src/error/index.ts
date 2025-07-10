export class ArchbaseError extends Error {
  constructor(message: string, public code?: string, public details?: unknown) {
    super(message);
    this.name = 'ArchbaseError';
  }
}

export class ArchbaseDataSourceError extends ArchbaseError {
  constructor(message: string, code?: string, details?: unknown) {
    super(message, code, details);
    this.name = 'ArchbaseDataSourceError';
  }
}

export class ArchbaseServiceError extends ArchbaseError {
  constructor(message: string, code?: string, details?: unknown) {
    super(message, code, details);
    this.name = 'ArchbaseServiceError';
  }
}