import React from 'react';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import axios from 'axios';

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
    axios.post('http://localhost:1337/create', {
        userId: this.props.userId,
        title: this.state.title,
        password: this.state.docPassword,
    }).then(json => {
      console.log(json.data.docId)
      this.props.navigate("doc", this.props.userId, json.data.docId)
    }).catch((err) => console.log(err))
  }

  render() {
    return (
      <div style={{textAlign: 'center',
      justifyContent: 'center'}}>
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
            onChange={e => this.setState({ title: e.target.value })}
          />
          <RaisedButton label="Create" primary={true} onClick={this.createDoc.bind(this)} />
        </Paper>
      </div>
    )
  }
}
