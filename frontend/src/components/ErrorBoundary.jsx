import { Component } from "react";

/**
 * Error Boundary component to catch and handle React component errors
 * Prevents entire app from crashing if a child component throws an error
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
    });
    // Log error to console in development
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <div style={styles.content}>
            <h1 style={styles.title}>Oops! Algo deu errado</h1>
            <p style={styles.message}>
              Desculpe, ocorreu um erro inesperado na aplicação.
            </p>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details style={styles.details}>
                <summary>Detalhes do erro</summary>
                <pre style={styles.stackTrace}>
                  {this.state.error.toString()}
                  {"\n"}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            <button onClick={this.resetError} style={styles.button}>
              Tentar novamente
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    fontFamily: "Arial, sans-serif",
  },
  content: {
    background: "white",
    borderRadius: "8px",
    padding: "40px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
    maxWidth: "500px",
    textAlign: "center",
  },
  title: {
    color: "#333",
    marginBottom: "10px",
    fontSize: "24px",
  },
  message: {
    color: "#666",
    marginBottom: "20px",
    fontSize: "16px",
  },
  details: {
    marginTop: "20px",
    padding: "10px",
    background: "#f5f5f5",
    borderRadius: "4px",
    textAlign: "left",
  },
  stackTrace: {
    marginTop: "10px",
    padding: "10px",
    background: "#f9f9f9",
    borderRadius: "4px",
    overflow: "auto",
    maxHeight: "200px",
    fontSize: "12px",
    color: "#e74c3c",
  },
  button: {
    marginTop: "20px",
    padding: "10px 20px",
    background: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "background 0.3s",
  },
};

export default ErrorBoundary;
