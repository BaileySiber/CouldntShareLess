import React from 'react';
import ReactDOM from 'react-dom';
import AppBar from 'material-ui/AppBar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Doc from './doc';
import Login from './login';
import Register from './register';
import Main from './mainPage';
import NewDoc from './newDoc';

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currPage: "login",
      userId: null
    }
  }

  navigate = (page) => {
    this.setState({currPage: page})
  }

  updatedocId = (id) => {
    this.setState({docId: id})
  }

  onLogin = (username, password) => {
    console.log('in onlogin')
    fetch ('http://localhost:1337/login' , {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    })
    .then(result => {
      console.log('result is' + result);
      return result.json();
    })
    .then(resultJson => {
      console.log(resultJson + 'in resultjson')
      if (resultJson.userId) {
        console.log('found user')
        this.setState({userId: resultJson.userId})
        this.navigate("main")
      }
    }).catch(err => console.log(err))
  }



    render() {
      return (
        <div>
          {this.state.currPage === "login" ?
          <Login navigate = {this.navigate} onLogin = {this.onLogin} /> : null }
          {this.state.currPage === "register" ?
          <Register navigate = {this.navigate} /> : null }
          {this.state.currPage === "main" ?
          <Main navigate = {this.navigate} /> : null }
          {this.state.currPage === "doc" ?
          <Doc navigate = {this.navigate} /> : null }
          {this.state.currPage === "newDoc" ?
          <NewDoc navigate = {this.navigate} /> : null }
        </div>
      );
    }
  }
