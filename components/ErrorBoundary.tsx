import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logError } from '../services/loggingService';
import { AlertIcon } from './Icons';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  public state: State;

  static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logError(error, { componentStack: errorInfo.componentStack });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 text-gray-200 flex items-center justify-center p-4">
            <div className="text-center my-auto p-8 bg-red-900/50 border border-red-700 rounded-lg max-w-lg">
                <AlertIcon className="w-16 h-16 mx-auto text-red-400" />
                <h1 className="text-2xl font-bold text-red-300 mt-4">Something went wrong.</h1>
                <p className="text-red-300 mt-2">
                    A critical error occurred in the application. We've been notified and are looking into it.
                    Please try refreshing the page.
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-6 px-4 py-2 text-sm font-semibold rounded-lg bg-red-600 hover:bg-red-500 text-white transition"
                >
                    Refresh Page
                </button>
            </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;