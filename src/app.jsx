import React from 'react';
import ReactDOM from 'react-dom';
import AppBar from 'material-ui/AppBar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Doc from './doc';

export default class App extends React.Component {
  render() {
    return (
      <div>
        <AppBar
          title="Title of the doc to edit"
          iconClassNameRight="muidocs-icon-navigation-expand-more"
        />
        <Doc />
      </div>
    );
  }
}
