import React from 'react';
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';


export default class History extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      lastEditTimeArray: [],
      contentArray: [],
      oldState: ''
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
      console.log("content history ---------> "+json.content, "lastEditTime history ------> " + json.lastEditTime)
      this.setState({
        contentArray: json.content,
        lastEditTimeArray: json.lastEditTime
      });
    }).catch(err => console.log(err))
  }

  onTime(index){
    this.setState({oldState: EditorState.createWithContent(convertFromRaw(contentArray[index]))})
  }

  render(){
    return (
      <div>

        <div style={{
          border: 'solid 1px',
          borderRadius: '5px',
          padding: '5px',
          margin: '10px',
          height: '50vh'
        }}>
        {this.state.lastEditTimeArray.map((timestamp, index) => <button onClick={()=> this.onTime(index)}> {timestamp} </button>)}
        </div>

        <div style={{
          border: 'solid 1px',
          borderRadius: '5px',
          padding: '5px',
          margin: '10px',
          height: '50vh'
        }}>
        // {EditorState.createWithContent(convertFromRaw(this.state.oldState))}
        </div>
      </div>
    );
  }

}
