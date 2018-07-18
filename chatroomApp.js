import React from 'react';
import Chatroom from './chatroom'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: io(),                       //one socket created for the application
      roomName: 'No room selected!',
    };
  }

  componentDidMount() {   //when component is actually alive
    // WebSockets Receiving Event Handlers
    this.state.socket.on('connect', () => {     //when socket gets 'connect' event
      console.log('connected');
      const username  = prompt('username');    //asking for the username at browser
      this.setState({username: username})           //save the username in our state
      this.state.socket.emit("username", username); //send the username to server

    });

    this.state.socket.on('errorMessage', message => {   //when socket gets 'error' event
      console.error(message)
      alert("Error: " + message)
    });
  }

  join(room) {
    this.setState({roomName: room})
    this.state.socket.emit('room', room)
  }

  render() {
    return (
      <div>
        <h1> {this.state.roomName} - {this.state.username} </h1>
        <button className="btn btn-default" onClick={() => this.join("Party Place")}>
          Join the Party Chat!
        </button>

        <Chatroom socket={this.state.socket} roomName={this.state.roomName} username={this.state.username}/>
      </div>
    );
  }
}

export default App;
