import { APIError } from '../services/api';

// Error types for consistent error handling
export const ErrorTypes = {
  NETWORK: 'NETWORK_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  AUTHENTICATION: 'AUTHENTICATION_ERROR',
  AUTHORIZATION: 'AUTHORIZATION_ERROR',
  NOT_FOUND: 'NOT_FOUND_ERROR',
  SERVER: 'SERVER_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
};

// Error severity levels
export const ErrorSeverity = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

// Standard error class for application errors
export class AppError extends Error {
  constructor(message, type = ErrorTypes.UNKNOWN, severity = ErrorSeverity.MEDIUM, details = {}) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.severity = severity;
    this.details = details;
    this.timestamp = new Date().toISOString();
    this.userMessage = this.generateUserMessage();
  }

  generateUserMessage() {
    switch (this.type) {
      case ErrorTypes.NETWORK:
        return 'Unable to connect to the server. Please check your internet connection.';
      case ErrorTypes.VALIDATION:
        return this.message; // Use the specific validation message
      case ErrorTypes.AUTHENTICATION:
        return 'Please log in to continue.';
      case ErrorTypes.AUTHORIZATION:
        return 'You do not have permission to perform this action.';
      case ErrorTypes.NOT_FOUND:
        return 'The requested item could not be found.';
      case ErrorTypes.SERVER:
        return 'A server error occurred. Please try again later.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }
}

// Error handler for processing different types of errors
export const handleError = (error, context = '') => {
  console.error(`Error in ${context}:`, error);

  // Handle API errors
  if (error instanceof APIError) {
    switch (error.statusCode) {
      case 400:
        return new AppError(error.message, ErrorTypes.VALIDATION, ErrorSeverity.LOW);
      case 401:
        return new AppError(error.message, ErrorTypes.AUTHENTICATION, ErrorSeverity.MEDIUM);
      case 403:
        return new AppError(error.message, ErrorTypes.AUTHORIZATION, ErrorSeverity.MEDIUM);
      case 404:
        return new AppError(error.message, ErrorTypes.NOT_FOUND, ErrorSeverity.LOW);
      case 500:
        return new AppError(error.message, ErrorTypes.SERVER, ErrorSeverity.HIGH);
      default:
        return new AppError(error.message, ErrorTypes.NETWORK, ErrorSeverity.MEDIUM);
    }
  }

  // Handle validation errors
  if (error.name === 'ValidationError') {
    return new AppError(error.message, ErrorTypes.VALIDATION, ErrorSeverity.LOW);
  }

  // Handle network errors
  if (!navigator.onLine) {
    return new AppError(
      'No internet connection', 
      ErrorTypes.NETWORK, 
      ErrorSeverity.MEDIUM,
      { offline: true }
    );
  }

  // Handle timeout errors
  if (error.name === 'TimeoutError' || error.message.includes('timeout')) {
    return new AppError(
      'Request timed out',
      ErrorTypes.NETWORK,
      ErrorSeverity.MEDIUM,
      { timeout: true }
    );
  }

  // Default error handling
  return new AppError(
    error.message || 'An unexpected error occurred',
    ErrorTypes.UNKNOWN,
    ErrorSeverity.MEDIUM,
    { originalError: error }
  );
};

// React hook for error handling in components
export const useErrorHandler = () => {
  const handleError = (error, context = 'Component') => {
    const processedError = handleError(error, context);
    
    // Log error for debugging
    console.error('Error handled:', processedError);
    
    // In production, you might want to send errors to a logging service
    if (process.env.NODE_ENV === 'production') {
      // Send to error logging service
      logErrorToService(processedError);
    }
    
    return processedError;
  };

  return { handleError };
};

// Error logging service (mock implementation)
const logErrorToService = (error) => {
  // In production, this would send errors to a service like Sentry, LogRocket, etc.
  console.log('Logging error to service:', {
    message: error.message,
    type: error.type,
    severity: error.severity,
    timestamp: error.timestamp,
    userAgent: navigator.userAgent,
    url: window.location.href
  });
};

// Validation error helpers
export const ValidationErrors = {
  required: (field) => new AppError(`${field} is required`, ErrorTypes.VALIDATION, ErrorSeverity.LOW),
  email: () => new AppError('Please enter a valid email address', ErrorTypes.VALIDATION, ErrorSeverity.LOW),
  password: () => new AppError('Password must be at least 8 characters long', ErrorTypes.VALIDATION, ErrorSeverity.LOW),
  phone: () => new AppError('Please enter a valid phone number', ErrorTypes.VALIDATION, ErrorSeverity.LOW),
  minLength: (field, length) => new AppError(`${field} must be at least ${length} characters`, ErrorTypes.VALIDATION, ErrorSeverity.LOW),
  maxLength: (field, length) => new AppError(`${field} cannot exceed ${length} characters`, ErrorTypes.VALIDATION, ErrorSeverity.LOW),
  pattern: (field, pattern) => new AppError(`${field} format is invalid`, ErrorTypes.VALIDATION, ErrorSeverity.LOW)
};

// Utility function to safely execute async operations with error handling
export const safeAsyncOperation = async (operation, context = 'Operation', fallbackValue = null) => {
  try {
    return await operation();
  } catch (error) {
    const processedError = handleError(error, context);
    
    // Don't throw for low severity errors, return fallback instead
    if (processedError.severity === ErrorSeverity.LOW && fallbackValue !== null) {
      return fallbackValue;
    }
    
    throw processedError;
  }
};

// Error boundary helper for React components
export const createErrorBoundary = (FallbackComponent) => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
      return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
      const processedError = handleError(error, 'ErrorBoundary');
      console.error('Error boundary caught error:', processedError, errorInfo);
      
      // Log to error service
      if (process.env.NODE_ENV === 'production') {
        logErrorToService(processedError);
      }
    }

    render() {
      if (this.state.hasError) {
        return <FallbackComponent error={this.state.error} />;
      }

      return this.props.children;
    }
  };
};

// Retry mechanism for failed operations
export const withRetry = async (operation, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      // Don't retry validation errors or client errors
      const processedError = handleError(error);
      if (processedError.type === ErrorTypes.VALIDATION || 
          processedError.type === ErrorTypes.AUTHORIZATION ||
          processedError.type === ErrorTypes.AUTHENTICATION) {
        throw processedError;
      }
      
      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
  }
  
  throw handleError(lastError, `Operation failed after ${maxRetries} attempts`);
};

export default {
  AppError,
  ErrorTypes,
  ErrorSeverity,
  handleError,
  ValidationErrors,
  safeAsyncOperation,
  withRetry,
  useErrorHandler
};