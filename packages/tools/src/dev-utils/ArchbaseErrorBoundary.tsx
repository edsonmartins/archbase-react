import React, { Component, ReactNode, ErrorInfo } from 'react';
import { emitDebugInfo } from '../debug/ArchbaseDebugPanel';

interface Props {
  children: ReactNode;
  fallback?: (error: Error, errorInfo: ErrorInfo) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showStack?: boolean;
  logToConsole?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorHistory: Array<{ error: Error; errorInfo: ErrorInfo; timestamp: number }>;
}

/**
 * Enhanced error boundary with debugging capabilities
 */
export class ArchbaseErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorHistory: []
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState(prevState => ({
      errorInfo,
      errorHistory: [
        ...prevState.errorHistory,
        { error, errorInfo, timestamp: Date.now() }
      ].slice(-10) // Keep last 10 errors
    }));

    // Log to console if enabled
    if (this.props.logToConsole !== false) {
      console.group('🚨 React Error Boundary');
      console.error('Error:', error);
      console.error('Component Stack:', errorInfo.componentStack);
      console.groupEnd();
    }

    // Emit debug info
    emitDebugInfo({
      type: 'performance',
      message: `Error in component: ${error.message}`,
      data: {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack
        },
        componentStack: errorInfo.componentStack
      }
    });

    // Call custom error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleClearHistory = () => {
    this.setState({ errorHistory: [] });
  };

  render() {
    if (this.state.hasError && this.state.error && this.state.errorInfo) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.state.errorInfo);
      }

      return <DefaultErrorFallback 
        error={this.state.error}
        errorInfo={this.state.errorInfo}
        errorHistory={this.state.errorHistory}
        showStack={this.props.showStack}
        onRetry={this.handleRetry}
        onClearHistory={this.handleClearHistory}
      />;
    }

    return this.props.children;
  }
}

interface DefaultErrorFallbackProps {
  error: Error;
  errorInfo: ErrorInfo;
  errorHistory: Array<{ error: Error; errorInfo: ErrorInfo; timestamp: number }>;
  showStack?: boolean;
  onRetry: () => void;
  onClearHistory: () => void;
}

const DefaultErrorFallback: React.FC<DefaultErrorFallbackProps> = ({
  error,
  errorInfo,
  errorHistory,
  showStack = process.env.NODE_ENV === 'development',
  onRetry,
  onClearHistory
}) => {
  const [showDetails, setShowDetails] = React.useState(false);
  const [showHistory, setShowHistory] = React.useState(false);

  const copyErrorInfo = () => {
    const errorText = `
Error: ${error.message}
Stack: ${error.stack}
Component Stack: ${errorInfo.componentStack}
    `.trim();
    
    navigator.clipboard.writeText(errorText).then(() => {
      alert('Error information copied to clipboard');
    });
  };

  return (
    <div style={{
      padding: '20px',
      margin: '20px',
      border: '2px solid #F44336',
      borderRadius: '8px',
      backgroundColor: '#FFEBEE',
      fontFamily: 'monospace',
      fontSize: '14px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
        <span style={{ fontSize: '24px', marginRight: '10px' }}>💥</span>
        <h2 style={{ margin: 0, color: '#D32F2F' }}>Something went wrong</h2>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <strong>Error:</strong> {error.message}
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <button
          onClick={onRetry}
          style={{
            padding: '8px 16px',
            backgroundColor: '#4CAF50',
            border: 'none',
            borderRadius: '4px',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          Try Again
        </button>
        <button
          onClick={() => setShowDetails(!showDetails)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#2196F3',
            border: 'none',
            borderRadius: '4px',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          {showDetails ? 'Hide' : 'Show'} Details
        </button>
        <button
          onClick={copyErrorInfo}
          style={{
            padding: '8px 16px',
            backgroundColor: '#FF9800',
            border: 'none',
            borderRadius: '4px',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          Copy Error
        </button>
        {errorHistory.length > 0 && (
          <button
            onClick={() => setShowHistory(!showHistory)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#9C27B0',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            History ({errorHistory.length})
          </button>
        )}
      </div>

      {showDetails && showStack && (
        <details style={{ marginBottom: '15px' }}>
          <summary style={{ cursor: 'pointer', marginBottom: '10px' }}>
            Stack Trace
          </summary>
          <pre style={{
            backgroundColor: '#F5F5F5',
            padding: '10px',
            borderRadius: '4px',
            overflow: 'auto',
            fontSize: '12px',
            border: '1px solid #E0E0E0'
          }}>
            {error.stack}
          </pre>
        </details>
      )}

      {showDetails && (
        <details style={{ marginBottom: '15px' }}>
          <summary style={{ cursor: 'pointer', marginBottom: '10px' }}>
            Component Stack
          </summary>
          <pre style={{
            backgroundColor: '#F5F5F5',
            padding: '10px',
            borderRadius: '4px',
            overflow: 'auto',
            fontSize: '12px',
            border: '1px solid #E0E0E0'
          }}>
            {errorInfo.componentStack}
          </pre>
        </details>
      )}

      {showHistory && errorHistory.length > 0 && (
        <details open>
          <summary style={{ cursor: 'pointer', marginBottom: '10px' }}>
            Error History
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClearHistory();
              }}
              style={{
                marginLeft: '10px',
                padding: '2px 6px',
                backgroundColor: '#F44336',
                border: 'none',
                borderRadius: '3px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '11px'
              }}
            >
              Clear
            </button>
          </summary>
          <div style={{
            backgroundColor: '#F5F5F5',
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #E0E0E0',
            maxHeight: '300px',
            overflow: 'auto'
          }}>
            {errorHistory.map((item, index) => (
              <div key={index} style={{
                padding: '8px',
                marginBottom: '8px',
                backgroundColor: 'white',
                borderRadius: '4px',
                border: '1px solid #E0E0E0'
              }}>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                  {new Date(item.timestamp).toLocaleString()}
                </div>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                  {item.error.message}
                </div>
                <details>
                  <summary style={{ cursor: 'pointer', fontSize: '12px' }}>
                    Stack Trace
                  </summary>
                  <pre style={{ 
                    fontSize: '10px', 
                    margin: '5px 0', 
                    overflow: 'auto',
                    maxHeight: '100px'
                  }}>
                    {item.error.stack}
                  </pre>
                </details>
              </div>
            ))}
          </div>
        </details>
      )}

      <div style={{
        fontSize: '12px',
        color: '#666',
        fontStyle: 'italic',
        marginTop: '15px'
      }}>
        💡 Tip: Check the browser console for more detailed error information
      </div>
    </div>
  );
};