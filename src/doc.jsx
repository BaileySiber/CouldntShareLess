import { Editor, EditorState, RichUtils } from 'draft-js';
import React from 'react';

export default class Doc extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editorState: EditorState.createEmpty() };
    this.onChange = editorState => this.setState({ editorState });
  }

  onBoldClick(e) {
    e.preventDefault();
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
  }

  // onItalicClick(e) {
  //   e.preventDefault();
  //   this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC'));
  // }

  // onUnderlineClick(e) {
  //   e.preventDefault();
  //   this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'UNDERLINE'));
  // }

//   const styleMap = {
//   'STRIKETHROUGH': {
//     textDecoration: 'line-through',
//   },
// };

  render() {
    return (<div>
      <button onMouseDown={e => this.onBoldClick(e)}>BOLD</button>
      <Editor
        editorState={this.state.editorState}
        // customStyleMap={styleMap}
        onChange={this.onChange}
      />
    </div>);
  }
}
