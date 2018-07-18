import React from 'react';
import docShare from "./docShare"

export default class DocApp extens React.Component {
  constructor(){
    super();
    this.state = {
      socket: io(),

    }
  }
  componentDidMount() {
    this.state.socket.on("shared", () => {
      console.log("shared doc is working!");
      this.setState({username: username})
      this.state.socket.emit("editorName", username)
    })
  }

}
