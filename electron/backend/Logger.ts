export enum LogLevel {
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
    DEBUG = 'DEBUG',
}

export class Logger {
    private scope: string;

    constructor(scope: string) {
        this.scope = scope;
    }

    private format(level: LogLevel, message: string, meta?: any) {
        const timestamp = new Date().toISOString();
        return `[${timestamp}] [${level}] [${this.scope}]: ${message} ${meta ? JSON.stringify(meta) : ''}`;
    }

    info(message: string, meta?: any) {
        console.log(this.format(LogLevel.INFO, message, meta));
    }

    warn(message: string, meta?: any) {
        console.warn(this.format(LogLevel.WARN, message, meta));
    }

    error(message: string, meta?: any) {
        console.error(this.format(LogLevel.ERROR, message, meta));
    }

    debug(message: string, meta?: any) {
        console.debug(this.format(LogLevel.DEBUG, message, meta));
    }
}
