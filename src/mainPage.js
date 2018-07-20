import React from 'react';
import ReactDOM from 'react-dom';
import AppBar from 'material-ui/AppBar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
const io = require('socket.io-client');
export default class Main extends React.Component {
  constructor(){
    super();
    this.socket = io("http://127.0.0.1:1337/")
    this.state={
      docId: "",
      myDocArray: [],
      sharedDocArray: []
    }
  }

 componentDidMount(){
    fetch("http://localhost:1337/getAllDocs?userId=" + this.props.userId)
    .then((res) => res.json())
    .then((json) => {
      console.log('my docs', json);
      this.setState({
        myDocArray: json.userDocs,
        sharedDocArray: json.collabDocs
      })
      console.log(json.userDocs)
    })
    .catch(err => console.log(err))
  }

  enterJoin() {
    //send docID, userId,
    fetch('http://localhost:1337/addCollaborator', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        docId: this.state.docId,
        userId: this.props.userId
      })
    })
    .then(res=> {
      return res.json();
    }).then(json=> {
      if (json.status === 200){
        this.props.navigate("doc", this.props.userId, this.state.docId)
      }
    })
    //add contributor
    //if you click, open the doc
    //fetch post collaborator
  }
  add(){
    //when you click, navigate to newDoc component
    this.props.navigate("newDoc")
  }

  render(){
    var miniUserDoc = []
    for(var i=0; i<this.state.myDocArray.length; i++){
      miniUserDoc.push(<MiniDoc
        title={this.state.myDocArray[i].title}
        docId={this.state.myDocArray[i].docId}
        navigate={this.props.navigate}
        userId={this.props.userId}
        />)
    }
    console.log(this.state.sharedDocArray);
    var miniSharedDoc = [];
    for(var i=0; i<this.state.sharedDocArray.length; i++){
      miniSharedDoc.push(<MiniDoc
        title={this.state.sharedDocArray[i].title}
        docId={this.state.sharedDocArray[i].docId}
        navigate={this.props.navigate}
        userId={this.props.userId}
        />)
    }
    return(
      <div style={{backgroundColor:"white", padding: "20px", paddingTop: "30px", border: "solid 15px", borderColor: "#a28baf"}}>
      {/* <AppBar
        title={this.state.title}
        onLeftIconButtonClick={() => this.showEditors}
      /> */}
      <br/>
      <div style={{fontFamily:'Lucida, sans-serif', fontSize:"40px", padding: 10, color: "#a28baf"}}>
        {this.props.username}'s Documents
        <button
          type="button"
          style={{
          width: "50px",
          height: "50px",
          border: 'none',
          fontSize: "30x",
          color: "white",
          backgroundColor: "#c6b8ce",
          float: "right"
        }}
        onClick={()=> this.add()}>
          Add
        </button>
      </div>
      <div style={{display: 'inlineBlock', height: "100px", border:"solid 8px", margin: 10, borderColor: "#a28baf", overflow: 'auto'}}>
      <table style={{width: '100%'}}>
          {miniUserDoc}
      </table>
    </div>
<br/>
<br/>
    <br/>
    <div style={{fontFamily:'Lucida, sans-serif', fontSize:"40px", padding: 10, color: "#a28baf"}}>
    Shared Documents
    </div>
    <div style={{display: 'inlineBlock', height: "100px", border:"solid 8px", margin: 10, borderColor: "#a28baf"}}>
      <table>
          {miniSharedDoc}
      </table>
    </div>

    <div style={{padding:10}}>
    <input style={{
      border: "solid 3px",
      borderColor: "#c6b8ce"
    }}type="string" placeholder="Document Id" onChange={(id)=> this.setState({docId: id.target.value})}></input>
    <button style={{width: "50px",
    textAlign: 'center',
    display: 'inline-block',
    padding: "10px",
    border: 'none',
    margin: '20px',
    fontSize: "30x",
    color: "white",
    backgroundColor: "#c6b8ce"}} onClick={()=> this.enterJoin()}>Enter</button>
    </div>
    </div>
  )
}
}
class MiniDoc extends React.Component {
  constructor(){
    super();
    this.state={}
  }

  onTitle(){
    this.props.navigate("doc", this.props.userId, this.props.docId)
  }

  render(){
    return(
      <tr style={{align: 'center'}}>
        <th>
          <button style={{backgroundColor: "white", height: 80, width: '90%', margin: 10, fontSize: '200%', border: 'solid 1px', borderColor: "black"}} onClick={() => this.onTitle()}> {this.props.title} </button>
        </th>
      </tr>
    )
  }
}
