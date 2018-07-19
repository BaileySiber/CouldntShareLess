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
      this.setState({
        myDocArray: json.userDocs,
        sharedDocArray: json.collabDocs
      })
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
    return(
      <div style={{backgroundColor:"#4C92C7"}}>
      <AppBar
        title={this.state.title}
        onLeftIconButtonClick={() => this.showEditors}
      />
      <div style={{fontFamily:'Times New Roman', fontSize:"30px", padding: 10, color: "white"}}>
        Your Documents
        <button
          type="button"
          style={{
          width: "50px",
          height: "50px",
          fontSize: "18px",
          borderRadius: "25px",
          color: "white",
          backgroundColor: "#095997",
          float: "right"
        }}
        onClick={()=> this.add()}
      >Add</button>
      </div>

      <div style={{height: "100px", border:"solid 1px", margin: 10, borderColor: "white"}}>

      {miniUserDoc}

      <div style={{padding: 15, paddingTop: 20}}>

    </div>
    </div>

    <div style={{fontFamily:'Times New Roman', fontSize:"30px", padding: 10, color: "white"}}>
    Shared Documents
    </div>
    <div style={{height: "100px", border:"solid 1px", margin: 10, borderColor: "white"}}>
    {this.state.sharedDocArray}
    </div>

    <div style={{padding:10}}>
    <input type="string" placeholder="Document Id" onChange={(id)=> this.setState({docId: id.target.value})}></input>
    <button onClick={()=> this.enterJoin()}>Enter</button>
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
      <div style={{display: 'inline'}}>
        <button style={{height: 80, width: 80, margin: 10, border: 'solid 1px'}} onClick={() => this.onTitle()}> <strong> {this.props.title} </strong></button>
      </div>
    )
  }
}
