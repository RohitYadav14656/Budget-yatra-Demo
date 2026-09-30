import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled Application Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F7F3EC] flex items-center justify-center p-4">
          <div className="bg-[#FFFCF7] border border-[#DED8CE] rounded-lg p-6 sm:p-8 max-w-md w-full text-center space-y-4 shadow-sm">
            <h2 className="text-xl font-serif font-bold text-[#20302D]">Something went wrong</h2>
            <p className="text-xs text-[#66706C]">
              An unexpected error occurred while loading this view.
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="px-4 py-2 bg-[#E86B4A] text-white text-xs font-bold rounded hover:bg-[#d65a39] transition-colors cursor-pointer"
            >
              Return to Planner
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
