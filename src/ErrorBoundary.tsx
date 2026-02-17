import React from "react";
import type { ReactNode } from "react";
import Layout from "./Layout";
import Heading from "./Heading";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  has_error: boolean;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { has_error: false };

  componentDidCatch() {
    this.setState({ has_error: true });
  }

  render() {
    if (this.state.has_error) {
      return (
        <Layout>
          <Heading text="Sad times :(" href="/" />
          <div className="columns">
            <img
              className="column col-6"
              style={{
                height: "100%",
              }}
              src={"/sad_panda.gif"}
              alt="sad_panda"
            />
            <pre
              className="code column col-6"
              style={{
                wordWrap: "break-word",
              }}
            ></pre>
          </div>
        </Layout>
      );
    }
    return this.props.children;
  }
}
