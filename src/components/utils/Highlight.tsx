import React, { Component, ReactNode } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/monokai-sublime.css';

// Static language imports
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
// Import other languages as needed

// Register languages globally
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('json', json);

interface HighlightProps {
  children: ReactNode;
  language?: string;
}

interface HighlightState {
  loaded: boolean;
}

class Highlight extends Component<HighlightProps, HighlightState> {
  private codeNode = React.createRef<HTMLElement>();

  // Constructor-based default prop assignment
  constructor(props: HighlightProps) {
    super(props);
    this.state = { loaded: true };
  }

  static defaultProps: Partial<HighlightProps> = {
    language: 'json',
  };

  componentDidMount() {
    this.highlight();
  }

  componentDidUpdate() {
    this.highlight();
  }

  highlight = () => {
    if (this.codeNode.current) {
      hljs.highlightBlock(this.codeNode.current);
    }
  };

  render() {
    const { language, children } = this.props;

    return (
      <pre className="rounded">
        <code ref={this.codeNode} className={language}>
          {children}
        </code>
      </pre>
    );
  }
}

export default Highlight;
