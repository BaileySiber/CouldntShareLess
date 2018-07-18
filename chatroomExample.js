import React from 'react';

export default class Chatroom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
			messages: []
		};
	}

	componentDidMount() {								//when component is actually alive
		this.props.socket.on("message", (message)=> {	//when socket gets a "message" event
			this.setState({messages: [...this.state.messages, `${message.username}: ${message.content}`]}) //make new array with old array items using splat (...), add on new string, back ticks and $ are ES6
		})
	}

	componentWillReceiveProps(nextProps) {
		console.log('componentWillReceiveProps', nextProps)
		if(nextProps.roomName !== this.props.roomName) {
			this.setState({
				message: "",
				messages: []
			})
		}
	}

	send() {

		let { message, messages } = this.state;			//pull out message and messages from current state
		let { username } = this.props;					//pull out username from this.props

		this.setState({
			message: "",
			messages: [...messages, `*${username}: ${message}`]		//push the new message onto the list of messages...* means that we are manually doing this
		});

		this.props.socket.emit("message", message)		//send out the message to whoever is listening

	}

	render() {			//basically just text tag
		return <div>
  <pre>
		{this.state.messages.map(message => message + "\n")}
		</pre>
		<input value={this.state.message} onChange={(event) => this.setState({message:event.target.value})}/>
		<button onClick={() => this.send()}> Send! </button>
		</div>;
	}

}

//onChange means someone is typing, add this to the pre-existing value
