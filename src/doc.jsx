import React from 'react';
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import Raw from 'draft-js-raw-content-state';
import createStyles from 'draft-js-custom-styles';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import FontIcon from 'material-ui/FontIcon';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import {Toolbar, ToolbarGroup, ToolbarSeparator} from 'material-ui/Toolbar';
import FlatButton from 'material-ui/FlatButton';
import axios from 'axios'
import io from 'socket.io-client'


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
  black: {
    color: '#000000',
  },
  arial: {
    fontFamily: "Arial Black, Gadget, sans-serif"
  },
  helvetica: {
    fontFamily: "Arial, Helvetica, sans-serif"
  },
  times: {
    fontFamily: "Times New Roman, Times, serif"
  },
  courier: {
    fontFamily: "Courier New, Courier, monospace"
  },
  verdana: {
    fontFamily: "Verdana, Geneva, sans-serif"
  },
  georgia: {
    fontFamily: "Georgia, serif"
  },
  comic: {
    fontFamily: "Comic Sans MS, cursive, sans-serif"
  },
  trebuchet: {
    fontFamily: "Trebuchet MS, Helvetica, sans-serif"
  },
  impact: {
    fontFamily: "Impact, Charcoal, sans-serif"
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
    case 'unordered-list-item':
    return 'unordered';
    case 'ordered-list-item':
    return 'ordered';
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
      title: "",
      owner: 'Owner',
      collaborators: [],
      showEditors: false,
      socket: io('http://localhost:1337/'),
      connected: null,
      disconnected: null
    };

    this.onChange = this.onChange.bind(this);
  }

  exit() {
    this.props.navigate('main')
  }

  history() {
    this.props.navigate('history', this.props.userId ,this.props.docId)
  }

  saveDoc() {
    fetch('http://localhost:1337/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        docId: this.props.docId,
        content: convertToRaw(this.state.editorState.getCurrentContent()),
        title: this.state.title,
      })
    }).then((res) => {
      if(res.status === 200) {
        console.log('success saving!')
      }
    }).catch(err => console.log(err))
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

  // toggleFontStyle(e, fontStyle) {
  //   const newEditorState = RichUtils.toggleInlineStyle(this.state.editorState, style)
  //   this.onChange(newEditorState)
  // }

  toggleColor(color) {
    const newEditorState = styles.color.toggle(this.state.editorState, color);
    this.onChange(newEditorState);
  }

  toggleAlignment(e, blockType) {
    const newEditorState = RichUtils.toggleBlockType(this.state.editorState, blockType)
    this.onChange(newEditorState)
  }

  showEditors() {
    this.setState({ showEditors: !this.state.showEditors })
  }

  onChange(editorState) {
    //read the documentation --> Milestone 3
    //realtime change for content, highlighting, title, cursor
    // this.state.socket.emit("realtimeContent", )
    this.setState({
      editorState: editorState
    }, () => {
      const currentContent = convertToRaw(editorState.getCurrentContent());
      this.state.socket.emit("realtimeContent", {
        content:currentContent,
        id:this.props.docId
      })
    })
  }


  componentDidMount(){

    //everyone who opens a doc
    this.state.socket.on('connect', () => {
      //everyone joins the room with the title of this.props.docId
      this.state.socket.emit("join", this.props.docId);

      //if no doc found(no one is currently editing it) use fetch
      this.state.socket.on("fetch", () => {

        axios.get("http://localhost:1337/getDocInfo?docId=" + this.props.docId)
        .then((json) => {
          console.log('content',json.data.document.content);
          this.setState({
            editorState: (json.data.document.content.length ? EditorState.createWithContent(convertFromRaw(json.data.document.content[json.data.document.content.length-1])) : EditorState.createEmpty()),
            title: json.data.document.title,
            owner: json.data.document.owner.username,
            collaborators: json.data.document.collaboratorList
          }, () => {
            this.state.socket.emit('setRoom', {
              docId: this.props.docId,
              roomContent: convertToRaw(this.state.editorState.getCurrentContent()),
            })
          });
        }).catch(err => console.log('ErRor', err))
      });

      this.state.socket.on("contentRender", content => {
        this.setState({
          editorState: EditorState.createWithContent(convertFromRaw(content))
        })
      })
    })
    //when people are already on the doc, use socket
    //edit --> unnecessary because already fetched, but learned to set up!
  }
  componentWillUnmount(){
    this.state.socket.emit("closeDoc", this.props.docId)
  }

  render() {
    const { editorState } = this.state;
    const inlineStyles = exporter(this.state.editorState);
    const html = stateToHTML(this.state.editorState.getCurrentContent(), { inlineStyles });
    const options = x => x.map(fontSize => {
      return <option key={fontSize} value={fontSize}>{fontSize}</option>;
    });
    // const options2 = x => x.map(fontStyle => {
    //   return <option key={fontFamily} value={fontStyle}>{fontStyle}</option>;
    // });

    // console.log('*******', this.state);


    return (
      <div>
        <AppBar
          title={this.state.title}
          onLeftIconButtonClick={this.showEditors.bind(this)}
          iconElementRight={<button style={{
            color: 'white',
            border: 'none',
            marginRight: "10px",
            marginTop: "8px",
            backgroundColor: "#a28baf",
            fontFamily: "Times New Roman",
            textAlign: 'center',
            display: 'inline-block',
            fontSize: '20px',
          }}>
          <img style={{height: 30}} src="./house.jpg"/></button>}
          onRightIconButtonClick={() => this.exit()}
          style={{backgroundColor: '#a28baf'}}
        />
        <Drawer open={this.state.showEditors} width='50%' style={{fontSize: '15px'}}>
          <MenuItem>Owner: {this.state.owner}</MenuItem>
          <MenuItem>Collaborators: <br/> <ul>{this.state.collaborators.map(user => <li>{user}</li>)}</ul></MenuItem>
          <MenuItem>Shareable Id: {this.props.docId}</MenuItem>
          <RaisedButton label="View History" onClick={() => this.history()} />
          <br/>
          <RaisedButton label="Close" onClick={this.showEditors.bind(this)} />
        </Drawer>
        <div style={{display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <input placeholder="Untitled" style={{width: '50%', fontSize: '25px', border: 'none', textAlign: 'center'}}onChange={(e) => this.setState({title:e.target.value})}
            value={this.state.title} />
          </div>
          <div style={{ display: 'flex', padding: '15px', flexDirection: "column" }}>
            <div style={{ flex: '1 0 25%', }}>
              <Toolbar style={{ textAlign: 'center', backgroundColor: '#c6b8ce', height: '40px', width: "100%" }}>
                <ToolbarGroup>
                  {/* <select onChange={e => this.toggleFontStyle(e, fontStyle)}>
                    {options2(['arial', 'comic', 'courier', 'georgia', 'helvetica', 'impact', 'times', 'trebuchet', 'verdana'])}
                  </select> */}
                  <ToolbarSeparator style={{height: '25px'}}/>
                  <button onMouseDown={e => this.onBoldClick(e)}><img style={{height: "20px"}} src="bold.png"/></button>
                  <button onMouseDown={e => this.onItalicClick(e)}><img style={{height: "18px", paddingTop: "1px", paddingBottom: "1px"}} src="italic.svg"/></button>
                  <button onMouseDown={e => this.onUnderlineClick(e)}><img style={{height: "18px", marginTop: "2px"}} src="underline.png"/></button>
                  <ToolbarSeparator style={{height: '25px'}}/>
                  <select style={{marginLeft: "20px"}} onChange={e => this.toggleFontSize(e.target.value)}>
                    {options(['12px', '24px', '36px', '50px', '72px'])}
                  </select>
                  <ToolbarSeparator style={{height: '25px'}}/>
                  <select style={{marginLeft: "20px"}} onChange={e => this.toggleColor(e.target.value)}>
                    {options(['green', 'blue', 'red', 'purple', 'orange', 'black'])}
                  </select>
                  <ToolbarSeparator style={{height: '25px'}}/>
                  <button onMouseDown={e => this.toggleAlignment(e, "left")}> <img style={{height: "18px", marginTop: "2px"}} src="left.png"/> </button>
                  <button onMouseDown={e => this.toggleAlignment(e, "center")}> <img style={{height: "18px", marginTop: "2px"}} src="center2.png"/> </button>
                  <button onMouseDown={e => this.toggleAlignment(e, "right")}> <img style={{height: "18px", marginTop: "2px"}} src="right.png"/> </button>
                  <ToolbarSeparator style={{height: '25px'}}/>
                  <button onMouseDown={e => this.toggleAlignment(e, "unordered-list-item")}><img style={{height: "18px", marginTop: "2px"}} src="bullets.png"/></button>
                  <button onMouseDown={e => this.toggleAlignment(e, "ordered-list-item")}><img style={{height:"18px", marginTop: "2px"}} src="numbers.png"/></button>
                </ToolbarGroup>
              </Toolbar>
            </div>

            <div style={{
              border: 'solid 1px',
              borderRadius: '5px',
              padding: '5px',
              margin: '10px',
              height: '50vh'
            }}>
            <Editor
              placeholder="Hello... write here!!"
              customStyleFn={customStyleFn}
              customStyleMap={customStyleMap}
              editorState={this.state.editorState}
              onChange={this.onChange}
              blockStyleFn={blockStyle}
            />
          </div>
          <br/>
          <button onClick={this.saveDoc.bind(this)} style={{
            backgroundColor: '#a28baf',
            paddingTop: '10px',
            paddingBottom: '10px',
            marginRight: '30%',
            marginLeft: '30%',
            borderRadius: '12px',
            color: 'white',
            border: 'none',
            fontFamily: "Times New Roman",
            textAlign: 'center',
            display: 'inline-block',
            fontSize: '14px',
          }}>Save</button>
        </div>
      </div>
    );
  }
}
