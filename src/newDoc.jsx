import React from 'react';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';

export default class CreateDoc extends React.Component {
  constructor(props)
  
  render() {
    return (
      <div>
        <Paper style={style} zDepth={2}>
          <TextField />
        </Paper>
      </div>
    )
  }
}
