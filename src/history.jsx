import React from 'react';
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';
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
  black: {
    color: '#000000',
  },
};


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
export default class History extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      lastEditTimeArray: [],
      contentArray: [],
      oldState: EditorState.createEmpty()
    }
  }

  // toggleHistory(e){
    //e is going to be a click on a certain timestamp
    //send that timestamp to the backend
    //findone from content array that matches timestamp
    //pass editor state back to the frontend
    //update editor state
  // }


  componentDidMount(){
    fetch("http://localhost:1337/getHistory?docId=" + this.props.docId)
    .then(result => {
      return result.json()
    })
    .then((json) => {
      console.log(json.content)
      this.setState({
        contentArray: json.content,
        lastEditTimeArray: json.lastEditTime.map(time=>(new Date(time)).toUTCString())
      });
    }).catch(err => console.log(err))
  }

  onTime(index){
    this.setState({
      oldState: EditorState.createWithContent(convertFromRaw(this.state.contentArray[index]))
    })
  }
  restore(){
    fetch('http://localhost:1337/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        docId: this.props.docId,
        content: convertToRaw(this.state.oldState.getCurrentContent()),
      })
    }).then(()=> {
      this.props.navigate("doc", this.props.userId, this.props.docId)
    })

  }

  render(){
    return (
      <div>
        <button type="button"
        style={{
        width: "100px",
        height: "50px",
        border: 'none',
        fontSize: "20px",
        color: "white",
        backgroundColor: "#c6b8ce",
        float: "right"
      }}
      onClick={() => this.props.navigate("doc", this.props.userId, this.props.docId)}> Back</button>
        <div style={{fontFamily:'Lucida, sans-serif', fontSize:"40px", padding: 10, color: "#a28baf"}}>
        {this.props.username}'s History
        </div>
        <div style={{display: 'inlineBlock', height: "100px", border:"solid 8px", margin: 10, borderColor: "#a28baf", overflow: 'auto'}}>
        {this.state.lastEditTimeArray.map((timestamp, index) => <button onClick={()=> this.onTime(index)}> {timestamp} </button>)}
        </div>
        <div style={{fontFamily:'Lucida, sans-serif', fontSize:"40px", padding: 10, color: "#a28baf"}}>
        Restore Version
        </div>
        <div style={{display: 'inlineBlock', height: "100px", border:"solid 8px", margin: 10, borderColor: "#a28baf", overflow: 'auto'}}>
          <Editor
            customStyleFn={customStyleFn}
            customStyleMap={customStyleMap}
            editorState={this.state.oldState}
            onChange={()=> {}}
            blockStyleFn={blockStyle}
            readOnly={true}/>
        </div>

        <div><button
         type="button"
         style={{
         width: "100px",
         height: "50px",
         border: 'none',
         fontSize: "20px",
         color: "white",
         backgroundColor: "#c6b8ce",
         float: "right"
       }}
       onClick={()=> this.restore()}>
         Restore
       </button></div>
      </div>
    );
  }

}
