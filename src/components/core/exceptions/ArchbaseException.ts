export class ArchbaseError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ArchbaseError';
  }
}

export class ArchbaseServiceError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ArchbaseServiceError';
  }
}

export class ArchbaseDataSourceError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ArchbaseDataSourceError';
  }
}
