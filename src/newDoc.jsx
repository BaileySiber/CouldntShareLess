import React from 'react';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

const style = {
  height: '70%',
  width: '50%',
  margin: 20,
  textAlign: 'center',
  justifyContent: 'center',
  display: 'inline-block',
};


export default class CreateDoc extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      docPassword: '',
      title: '',
    };
  }

  createDoc() {
    fetch('http:/localhost:1337/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        owner: this.props.userId,
        title: this.state.title,
        password: this.state.docPassword,
      })
    }).then(result => {
      console.log('success')
      return result.json();
    }).then(json => {
      this.props.navigate("doc", this.props.userId, json.docId)
    })
  }

  render() {
    return (
      <div>
        <Paper style={style} zDepth={2}>
          <TextField
            hintText="Username"
            floatingLabelText="username"
            onChange={e => this.setState({ username: e.target.value })}
          />
          <TextField
            hintText="Password to access the doc"
            floatingLabelText="password"
            onChange={e => this.setState({ docPassword: e.target.value })}
          />
          <TextField
            floatingLabelText="Document Title"
            defaultValue="Untitled"
            onChange={e => this.setState({ username: e.target.value })}
          />
          <RaisedButton label="Create" primary={true} onClick={() => this.createDoc} />
        </Paper>
      </div>
    )
  }
}
