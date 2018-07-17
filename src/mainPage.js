import React from 'react';
import ReactDOM from 'react-dom';
import AppBar from 'material-ui/AppBar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

export default class Main extends React.Component {
  constructor(){
    super();
    this.state={
      docId: ""
    }
  }


  enterJoin() {
    //if you click, open the doc

  }
  add(){
    //when you click, navigate to newDoc component
    this.props.navigate("createDoc")
  }

  render(){
    return(
      <div style={{backgroundColor:"#4C92C7"}}>
      <AppBar
        title={this.state.title}
        onLeftIconButtonClick={() => this.showEditors}
      />
      <div style={{fontFamily:'Times New Roman', fontSize:"30px", padding: 10, color: "white"}}>
      Your Documents
      </div>

      <div style={{height: "100px", border:"solid 1px", margin: 10, borderColor: "white"}}>

      <div style={{padding: 15, paddingTop: 20}}>
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
    </div>

    <div style={{fontFamily:'Times New Roman', fontSize:"30px", padding: 10, color: "white"}}>
    Shared Documents
    </div>
    <div style={{height: "100px", border:"solid 1px", margin: 10, borderColor: "white"}}></div>

    <div style={{padding:10}}>
    <input type="string" placeholder="Document Id" onChange={(id)=> this.setState({docId: id})}></input>
    <button onClick={()=> this.enterJoin()}>Enter</button>
    </div>
    </div>
  )
}
}
