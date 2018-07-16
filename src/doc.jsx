import { Editor, EditorState, RichUtils } from 'draft-js';

constructor(props) {
  super(props);
  this.state = {editorState: EditorState.createEmpty()};
  this.onChange = (editorState) => this.setState({editorState});
}

_onBoldClick(e) {
  e.preventDefault()
  this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
}

_onBoldClick(e) {
  e.preventDefault()
  this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
}

render() {
  return (<div>
    <button onMouseDown={(e) => this._onBoldClick(e)}>BOLD</button>
    <Editor
      editorState={this.state.editorState}
      onChange={this.onChange}
    />
  </div>);
}
