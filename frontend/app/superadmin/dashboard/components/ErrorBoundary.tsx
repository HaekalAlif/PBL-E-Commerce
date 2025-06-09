"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(
      "Dashboard Error Boundary caught an error:",
      error,
      errorInfo
    );
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="p-6 m-4">
          <div className="flex flex-col items-center text-center space-y-4">
            <AlertTriangle className="w-12 h-12 text-red-500" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Dashboard Error
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Something went wrong while loading the dashboard component.
              </p>
              {this.state.error && (
                <details className="mt-2 text-xs text-gray-500">
                  <summary className="cursor-pointer">Error details</summary>
                  <pre className="mt-2 p-2 bg-gray-100 rounded text-left overflow-auto">
                    {this.state.error.message}
                  </pre>
                </details>
              )}
            </div>
            <Button
              onClick={this.handleReset}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          </div>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
