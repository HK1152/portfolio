import React, { Component } from 'react';
import { AlertTriangle, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('⚠️ [ErrorBoundary Caught Error]:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  toggleDetails = () => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isSection = this.props.isSection;

      return (
        <div
          className={`${
            isSection
              ? 'py-16 px-4 my-8 rounded-3xl border border-red-500/20 bg-neutral-900/60 backdrop-blur-xl'
              : 'min-h-screen p-6 flex flex-col items-center justify-center bg-neutral-950 text-white'
          } flex flex-col items-center justify-center text-center`}
        >
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-6 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
            <AlertTriangle size={32} />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">
            {isSection ? 'Component Failed to Load' : 'Something went wrong'}
          </h2>

          <p className="text-neutral-400 max-w-md mb-6 text-sm md:text-base">
            {isSection
              ? 'An error occurred while rendering this section. You can try refreshing it.'
              : 'We encountered an unexpected error while loading the portfolio.'}
          </p>

          <div className="flex flex-wrap gap-4 justify-center items-center">
            <button
              onClick={this.handleReset}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded-full transition-all active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer"
            >
              <RefreshCw size={16} />
              Try Again
            </button>

            {!isSection && (
              <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 px-6 py-3 border border-neutral-700 hover:border-neutral-500 text-neutral-300 hover:text-white font-semibold rounded-full transition-all cursor-pointer"
              >
                Reload Page
              </button>
            )}

            {this.state.error && (
              <button
                onClick={this.toggleDetails}
                className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-200 underline py-2 cursor-pointer"
              >
                {this.state.showDetails ? 'Hide Error Details' : 'View Error Details'}
                {this.state.showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            )}
          </div>

          {this.state.showDetails && this.state.error && (
            <div className="mt-6 p-4 max-w-2xl w-full text-left bg-black/80 border border-neutral-800 rounded-2xl overflow-x-auto text-xs font-mono text-red-300">
              <p className="font-bold text-red-400 mb-1">{this.state.error.toString()}</p>
              <pre className="text-neutral-400 whitespace-pre-wrap">
                {this.state.errorInfo?.componentStack || this.state.error.stack}
              </pre>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
