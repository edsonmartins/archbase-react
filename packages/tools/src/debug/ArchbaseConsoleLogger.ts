/**
 * Enhanced console logger with colored output and grouping
 */
export class ArchbaseConsoleLogger {
  private static instance: ArchbaseConsoleLogger;
  private enabled: boolean = true;
  private logLevel: 'debug' | 'info' | 'warn' | 'error' = 'debug';
  private prefix: string = '[Archbase]';

  private constructor() {}

  static getInstance(): ArchbaseConsoleLogger {
    if (!ArchbaseConsoleLogger.instance) {
      ArchbaseConsoleLogger.instance = new ArchbaseConsoleLogger();
    }
    return ArchbaseConsoleLogger.instance;
  }

  setEnabled(enabled: boolean): this {
    this.enabled = enabled;
    return this;
  }

  setLogLevel(level: 'debug' | 'info' | 'warn' | 'error'): this {
    this.logLevel = level;
    return this;
  }

  setPrefix(prefix: string): this {
    this.prefix = prefix;
    return this;
  }

  private shouldLog(level: 'debug' | 'info' | 'warn' | 'error'): boolean {
    if (!this.enabled) return false;
    const levels = { debug: 0, info: 1, warn: 2, error: 3 };
    return levels[level] >= levels[this.logLevel];
  }

  debug(message: string, ...args: any[]): void {
    if (this.shouldLog('debug')) {
      console.log(
        `%c${this.prefix} [DEBUG]`,
        'color: #9CA3AF; font-weight: bold',
        message,
        ...args
      );
    }
  }

  info(message: string, ...args: any[]): void {
    if (this.shouldLog('info')) {
      console.log(
        `%c${this.prefix} [INFO]`,
        'color: #3B82F6; font-weight: bold',
        message,
        ...args
      );
    }
  }

  warn(message: string, ...args: any[]): void {
    if (this.shouldLog('warn')) {
      console.warn(
        `%c${this.prefix} [WARN]`,
        'color: #F59E0B; font-weight: bold',
        message,
        ...args
      );
    }
  }

  error(message: string, error?: Error, ...args: any[]): void {
    if (this.shouldLog('error')) {
      console.error(
        `%c${this.prefix} [ERROR]`,
        'color: #EF4444; font-weight: bold',
        message,
        error,
        ...args
      );
      if (error?.stack) {
        console.error(error.stack);
      }
    }
  }

  group(label: string, fn: () => void): void {
    if (this.enabled) {
      console.group(`%c${this.prefix} ${label}`, 'font-weight: bold');
      fn();
      console.groupEnd();
    }
  }

  time(label: string): void {
    if (this.enabled) {
      console.time(`${this.prefix} ${label}`);
    }
  }

  timeEnd(label: string): void {
    if (this.enabled) {
      console.timeEnd(`${this.prefix} ${label}`);
    }
  }

  table(data: any[], columns?: string[]): void {
    if (this.enabled) {
      console.log(`%c${this.prefix} [TABLE]`, 'color: #8B5CF6; font-weight: bold');
      console.table(data, columns);
    }
  }
}

export const logger = ArchbaseConsoleLogger.getInstance();