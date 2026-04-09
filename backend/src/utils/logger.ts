type LogLevel = "INFO" | "WARN" | "ERROR";

class Logger {
  private print(level: LogLevel, message: string, context?: unknown): void {
    const timestamp = new Date().toISOString();

    if (context === undefined) {
      console.log(`[${timestamp}] [${level}] ${message}`);
      return;
    }

    console.log(`[${timestamp}] [${level}] ${message}`, context);
  }

  public info(message: string, context?: unknown): void {
    this.print("INFO", message, context);
  }

  public warn(message: string, context?: unknown): void {
    this.print("WARN", message, context);
  }

  public error(message: string, context?: unknown): void {
    this.print("ERROR", message, context);
  }
}

const logger = new Logger();

export default logger;
