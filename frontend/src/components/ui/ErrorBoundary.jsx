import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    // Safely log
    try {
      console.log('Error caught by boundary:', error.message);
    } catch(e) {}
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-3xl w-full bg-neutral-900 border border-neutral-800 rounded-3xl p-8 flex flex-col items-center text-center shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-6 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
              <AlertTriangle size={32} />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
            <p className="text-neutral-400 mb-8">
              We're sorry, but there was an error rendering this page.
            </p>
            
            <div className="w-full text-left bg-black p-4 rounded text-red-400 font-mono text-xs overflow-auto max-h-96 mb-8">
               <p className="font-bold">{this.state.error?.toString()}</p>
               <pre className="mt-2">{this.state.errorInfo?.componentStack}</pre>
            </div>

            <div className="flex flex-wrap gap-4 justify-center items-center">
              <button
                onClick={this.handleReset}
                className="flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-black font-semibold rounded-full transition-all active:scale-95 shadow-[0_0_20px_rgba(0,29,81,0.3)] cursor-pointer"
              >
                <RefreshCw size={16} />
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
