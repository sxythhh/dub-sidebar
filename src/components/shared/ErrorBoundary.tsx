"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { Component, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {}

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex items-center justify-center min-h-screen bg-background px-4">
          <div className="max-w-md w-full auth-error-card-bg border border-solid border-primary/12 rounded-[20px] p-8">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="p-4 rounded-full auth-error-icon-bg border auth-error-icon-border">
                <AlertCircle className="size-8 text-destructive" />
              </div>

              <div className="space-y-2">
                <h2 className="text-[20px] font-bold leading-[1.3] tracking-[-0.47px] text-foreground font-inter">
                  Something went wrong
                </h2>
                <p className="text-[14px] leading-[20px] text-muted-foreground font-inter-display">
                  We encountered an error while loading this page. Please try
                  refreshing.
                </p>
              </div>

              {process.env.NODE_ENV === "development" && this.state.error && (
                <div className="w-full mt-2 p-4 auth-error-debug-bg rounded-lg border auth-error-debug-border">
                  <p className="text-[12px] text-muted-foreground/75 font-mono break-all">
                    {this.state.error.message}
                  </p>
                </div>
              )}

              <button
                onClick={this.handleReset}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary/12 border border-primary/32 hover:bg-primary/16 transition-colors text-foreground font-inter-display font-medium text-[14px] leading-[20px] tracking-[0.14px] mt-2"
              >
                <RefreshCw className="size-4" />
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
