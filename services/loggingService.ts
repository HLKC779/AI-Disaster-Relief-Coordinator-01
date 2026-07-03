interface LogContext {
  [key: string]: any;
}

export const logError = (error: Error, context?: LogContext): void => {
  const logEntry = {
    level: 'error',
    timestamp: new Date().toISOString(),
    message: error.message,
    name: error.name,
    stack: error.stack,
    context: context || {},
    url: window.location.href,
  };
  
  // In a real app, you would send this to a service like Sentry, LogRocket, etc.
  // For now, we'll just log it to the console in a structured way for easier debugging.
  console.error(JSON.stringify(logEntry, null, 2));
};
