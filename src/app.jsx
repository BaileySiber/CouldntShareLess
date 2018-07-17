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
      currPage: "login"
    }
  }

  navigate = (page) => {
    this.setState({currPage: page})
  }

  render() {
    return (
      <div>
        {this.state.currPage === "login" ?
        <Login navigate = {this.navigate} /> : null }
        {this.state.currPage === "register" ?
        <Register navigate = {this.navigate} /> : null }
        {this.state.currPage === "doc" ?
        <Doc navigate = {this.navigate} /> : null }
      </div>
    );
  }
}
