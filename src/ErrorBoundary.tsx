import type { ReactNode } from "react";
import React from "react";
import Heading from "./Heading.tsx";
import Layout from "./Layout.tsx";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  componentDidCatch() {
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Layout>
          <Heading text="Sad times :(" href="/" />
          <div className="columns">
            <img
              className="column col-6"
              src="/sad_panda.gif"
              alt="sad_panda"
              width="400"
              height="300"
            />
            <pre
              className="code column col-6"
              style={{
                wordWrap: "break-word",
              }}
            />
          </div>
        </Layout>
      );
    }
    return this.props.children;
  }
}
