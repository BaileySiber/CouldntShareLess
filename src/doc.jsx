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

  saveDoc() {
    fetch('http://localhost:1337/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        docId: this.props.docId,
        content: convertToRaw(this.state.editorState.getCurrentContent()),
        title: this.state.title
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
          this.setState({
            editorState: json.data.document.content.length? EditorState.createWithContent(convertFromRaw(json.data.document.content[json.data.document.content.length-1])) : EditorState.createEmpty(),
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
  				}}><img style={{height: 30}} src="./house.jpg"/></button>}
          onRightIconButtonClick={() => this.exit()}
          style={{backgroundColor: '#a28baf'}}
        />
        <Drawer open={this.state.showEditors} width='40%'>
          <MenuItem>Owner: </MenuItem>
          <MenuItem>{this.state.owner}</MenuItem>
          <MenuItem>Collaborators: <br/> {this.state.collaborators}</MenuItem>
          <MenuItem>Shareable Id: {this.state.docId}</MenuItem>
          {this.state.collaborators.map(user => <MenuItem>{user}</MenuItem>)}
          <RaisedButton label="Close" onClick={this.showEditors.bind(this)} />
        </Drawer>
        <div style={{display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <input placeholder="Untitled" style={{width: '50%', fontSize: '25px', border: 'none', textAlign: 'center'}}onChange={(e) => this.setState({title:e.target.value})}
            value={this.state.title} />
        </div>
        <div style={{ display: 'flex', padding: '15px', flexDirection: "column" }}>
          <div style={{ flex: '1 0 25%', }}>
            <Toolbar style={{ textAlign: 'center', backgroundColor: '#c6b8ce', height: '35px' }}>
              <ToolbarGroup>
                <ToolbarSeparator />
                <button onMouseDown={e => this.onBoldClick(e)}>B</button>
                <button onMouseDown={e => this.onItalicClick(e)}>I</button>
                <button onMouseDown={e => this.onUnderlineClick(e)}>U</button>
                <ToolbarSeparator />
              <select onChange={e => this.toggleFontSize(e.target.value)}>
                {options(['12px', '24px', '36px', '50px', '72px'])}
              </select>
              <ToolbarSeparator />
              <select onChange={e => this.toggleColor(e.target.value)}>
                {options(['green', 'blue', 'red', 'purple', 'orange', 'black'])}
              </select>
              <ToolbarSeparator />
                <button onMouseDown={e => this.toggleAlignment(e, "left")}> Left </button>
                <button onMouseDown={e => this.toggleAlignment(e, "center")}> Center </button>
                <button onMouseDown={e => this.toggleAlignment(e, "right")}> Right </button>
                <ToolbarSeparator />
                <button onMouseDown={e => this.toggleAlignment(e, "unordered-list-item")}>Unordered List</button>
                <button onMouseDown={e => this.toggleAlignment(e, "ordered-list-item")}>Ordered List</button>
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
