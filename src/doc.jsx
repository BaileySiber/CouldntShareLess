import React from 'react';
import { Editor, EditorState, RichUtils, convertToRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import Raw from 'draft-js-raw-content-state';
import createStyles from 'draft-js-custom-styles';


const customStyleMap = {
  green: {
    color: "#36db39"
  },
  blue: {
    color:"#0019ff"
  },
  red: {
    color:"#ff0000"
  },
  purple: {
    color:"#a100ff"
  },
  orange: {
    color:"#ff8c00"
  },
}

const blockStyle = (block) => {
  switch (block.getType()) {
    case 'left':
    return 'align-left';
    case 'center':
    return 'align-center';
    case 'right':
    return 'align-right';
    default:
    return null;
  }
}

const { styles, customStyleFn, exporter } = createStyles(['font-size', 'color'], 'PREFIX', customStyleMap);

// color
const toggleColor = styles.color.toggle;
const addColor = styles.color.add;
const removeColor = styles.color.remove;
const currentColor = styles.color.current;

// fontSize
const toggleFontSize = styles.fontSize.toggle;
const addFontSize = styles.fontSize.add;
const removeFontSize = styles.fontSize.remove;
const currentFontSize = styles.fontSize.current;

export default class Doc extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
    };
    this.onChange = editorState => this.setState({ editorState });
  }

  onBoldClick(e) {
    e.preventDefault();
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
  }

  onItalicClick(e) {
    e.preventDefault();
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC'));
  }

  onUnderlineClick(e) {
    e.preventDefault();
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'UNDERLINE'));
  }


  toggleFontSize(fontSize) {
    const newEditorState = styles.fontSize.toggle(this.state.editorState, fontSize);
    this.onChange(newEditorState);
  }


  toggleColor(color) {
    const newEditorState = styles.color.toggle(this.state.editorState, color);
    this.onChange(newEditorState);
  }

  toggleAlignment(e, align) {
    const newEditorState = RichUtils.toggleBlockType(this.state.editorState, align)
    this.onChange(newEditorState)
  }

  render() {
    const { editorState } = this.state;
    const inlineStyles = exporter(this.state.editorState);
    const html = stateToHTML(this.state.editorState.getCurrentContent(), { inlineStyles });
    const options = x => x.map(fontSize => {
      return <option key={fontSize} value={fontSize}>{fontSize}</option>;
    });

    return (
      <div>
        <h1>Doc Title</h1>

        <div style={{ display: 'flex', padding: '15px', flexDirection: "column" }}>
          <div style={{ flex: '1 0 25%' }}>

            <button onMouseDown={e => this.onBoldClick(e)}>BOLD</button>
            <button onMouseDown={e => this.onItalicClick(e)}>ITALICS</button>
            <button onMouseDown={e => this.onUnderlineClick(e)}>UNDERLINE</button>


            <select onChange={e => this.toggleFontSize(e.target.value)}>
              {options(['12px', '24px', '36px', '50px', '72px'])}
            </select>

            <select onChange={e => this.toggleColor(e.target.value)}>
              {options(['green', 'blue', 'red', 'purple', 'orange'])}
            </select>

            <button onMouseDown={e => this.toggleAlignment(e, "right")}> Align right </button>
            <button onMouseDown={e => this.toggleAlignment(e, "left")}> Align left </button>
            <button onMouseDown={e => this.toggleAlignment(e, "center")}> Align center </button>

          </div>

          <div style={{ flex: '1 0 25%' }}>
            <Editor
              placeholder="Hello... write here!!"
              customStyleFn={customStyleFn}
              customStyleMap={customStyleMap}
              editorState={editorState}
              onChange={this.onChange}
              blockStyleFn={blockStyle}
            />
          </div>
        </div>
      </div>
    );
  }
}
