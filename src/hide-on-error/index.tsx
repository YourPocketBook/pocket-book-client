import React from "react";

export class HideOnError extends React.Component<{}, { hasError: boolean }> {

  public static getDerivedStateFromError() {
    return { hasError: true };
  }
  constructor(props: {}) {
    super(props);
    this.state = { hasError: false };
  }

  public render() {
    if (this.state.hasError) {
      return null;
    }

    return this.props.children;
  }
}
