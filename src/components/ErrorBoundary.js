import React from 'react';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console and state
    console.error('Error caught by boundary:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // You could also log to an error reporting service here
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-container">
            <div className="error-icon">🎨</div>
            <h1>Oops! Something went wrong</h1>
            <p>It looks like our creative canvas encountered an error. Don't worry, even great artists make mistakes!</p>
            
            <div className="error-details">
              <h3>Error Details:</h3>
              <p className="error-message">
                {this.state.error && this.state.error.toString()}
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                <details className="error-stack">
                  <summary>Stack Trace (Development Only)</summary>
                  <pre>{this.state.errorInfo.componentStack}</pre>
                </details>
              )}
            </div>
            
            <div className="error-actions">
              <button onClick={this.handleReset} className="reset-btn">
                Try Again
              </button>
              <button onClick={() => window.location.href = '/home'} className="home-btn">
                Go Home
              </button>
            </div>
            
            <div className="error-help">
              <h3>Need Help?</h3>
              <p>If this problem persists, you can:</p>
              <ul>
                <li>Refresh the page</li>
                <li>Check your internet connection</li>
                <li>Contact our support team</li>
                <li>Try accessing a different page</li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
