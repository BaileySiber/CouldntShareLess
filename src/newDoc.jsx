import React from 'react';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import axios from 'axios';

const style = {
  height: '100%',
  width: '70%',
  margin: 20,
  padding: 50,
  textAlign: 'center',
  justifyContent: 'center',
  display: 'inline-block',
};


export default class CreateDoc extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
    };
  }

  createDoc() {
    axios.post('http://localhost:1337/create', {
        userId: this.props.userId,
        title: this.state.title,
    }).then(json => {
      console.log(json.data.docId);
      this.props.navigate("doc", this.props.userId, json.data.docId);
    }).catch((err) => console.log(err))
  }

  render() {
    return (
      <div style={{textAlign: 'center',
      justifyContent: 'center'}}>
        <Paper style={style} zDepth={2}>
          <TextField

            floatingLabelText="Document Title"
            defaultValue="Untitled"
            onChange={e => this.setState({ title: e.target.value })}
          />
        <br/>
        <br/>
          <button style={{
            backgroundColor: '#c6b8ce',
            paddingTop: '10px',
            paddingBottom: '10px',
            paddingRight: '35px',
            paddingLeft: '35px',
            borderRadius: '12px',
            color: 'white',
            border: 'none',
            fontFamily: "Times New Roman",
            textAlign: 'center',
            display: 'inline-block',
            fontSize: '14px',
            margin: '2px'
          }} onClick={this.createDoc.bind(this)}>Create</button>
          <button style={{
            backgroundColor: '#c6b8ce',
            paddingTop: '10px',
            paddingBottom: '10px',
            paddingRight: '35px',
            paddingLeft: '35px',
            borderRadius: '12px',
            color: 'white',
            border: 'none',
            fontFamily: "Times New Roman",
            textAlign: 'center',
            display: 'inline-block',
            fontSize: '14px',
            margin: '2px'
          }} onClick={()=> this.props.navigate("main")}> Cancel </button>
        </Paper>
      </div>
    )
  }
}
