import React from 'react';
import ReactDOM from 'react-dom';
import AppBar from 'material-ui/AppBar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Doc from './doc';
import Login from './login';
import Register from './register';

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

  onLogin = () => {
    fetch (URL + '/login' , {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: this.state.usn,
        password: this.state.password
      })
    })
    .then(result => result.json())
    .then(resultJson => {
      if (result.userId) {
        console.log('found user')
        this.setState({userId: result.userId})
        this.props.navigate("main")
      }
    })



    render() {
      return (
        <div>
          {this.state.currPage === "login" ?
          <Login navigate = {this.navigate} onLogin = {this.onLogin} /> : null }
          {this.state.currPage === "register" ?
          <Register navigate = {this.navigate} /> : null }
          {/* {this.state.currPage === "main" ?
          <Main navigate = {this.navigate} /> : null } */}
          {this.state.currPage === "doc" ?
          <Doc navigate = {this.navigate} /> : null }
        </div>
      );
    }
  }
