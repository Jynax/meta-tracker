import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallbackLabel?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary] ' + (this.props.fallbackLabel ?? 'Component') + ' crashed:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto max-w-md rounded-xl border border-rose-500/30 bg-slate-900 p-8 text-center">
          <p className="text-lg font-semibold text-rose-400">
            {this.props.fallbackLabel ?? 'This section'} failed to render
          </p>
          <p className="mt-2 text-sm text-slate-400">
            {this.state.error?.message ?? 'An unexpected error occurred.'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-4 rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-sm text-slate-200 hover:brightness-110"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
