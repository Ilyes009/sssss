enum LogLevel {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error'
}

interface LogMessage {
  level: LogLevel;
  message: string;
  timestamp: string;
}

export class Logger {
  private static instance: Logger;
  private logs: LogMessage[] = [];

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private log(level: LogLevel, message: string, error?: any) {
    const logMessage = {
      level,
      message,
      timestamp: new Date().toISOString()
    };

    this.logs.push(logMessage);
    
    const consoleMessage = `[${logMessage.timestamp}] ${message}`;
    
    switch (level) {
      case LogLevel.SUCCESS:
        console.log('\x1b[32m%s\x1b[0m', consoleMessage);
        break;
      case LogLevel.WARNING:
        console.warn('\x1b[33m%s\x1b[0m', consoleMessage);
        break;
      case LogLevel.ERROR:
        console.error('\x1b[31m%s\x1b[0m', consoleMessage);
        if (error) console.error(error);
        break;
      default:
        console.log('\x1b[34m%s\x1b[0m', consoleMessage);
    }
  }

  public info(message: string) {
    this.log(LogLevel.INFO, message);
  }

  public success(message: string) {
    this.log(LogLevel.SUCCESS, message);
  }

  public warning(message: string) {
    this.log(LogLevel.WARNING, message);
  }

  public error(message: string, error?: any) {
    this.log(LogLevel.ERROR, message, error);
  }

  public getLogs(): LogMessage[] {
    return [...this.logs];
  }
}