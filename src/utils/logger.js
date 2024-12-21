const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
};

class Logger {
  constructor() {
    this.level = process.env.NODE_ENV === 'production' ? LOG_LEVELS.INFO : LOG_LEVELS.DEBUG;
  }

  debug(message, data = {}) {
    if (this.level <= LOG_LEVELS.DEBUG) {
      console.debug(`[DEBUG] ${message}`, data);
    }
  }

  info(message, data = {}) {
    if (this.level <= LOG_LEVELS.INFO) {
      console.info(`[INFO] ${message}`, data);
    }
  }

  warn(message, data = {}) {
    if (this.level <= LOG_LEVELS.WARN) {
      console.warn(`[WARN] ${message}`, data);
    }
  }

  error(message, error = null) {
    if (this.level <= LOG_LEVELS.ERROR) {
      console.error(`[ERROR] ${message}`, error);
    }
  }
}

export const logger = new Logger(); 