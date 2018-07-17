import React from 'react';


class Login extends React.Component {
	constructor() {
		super()
		this.state = {
			usn: "",
			password: ""
		}
	}

	onUsnChange = (e) => {
		this.setState({
			usn: event.target.value
		})
	}

	onPassChange = (e) => {
		this.setState({
			pass: event.target.value
		})
	}

	onLogin = (e) => {
		fetch (URL + '/login' , {
  		method: 'POST',
  		headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        usn: this.state.usn,
        password: this.state.password
      })
  	}).then((res) => {
  		if (res.status === 200) {
  			console.log('found user')
  		}
  	})

	}

	onRegister = () => {
		this.props.navigate("register")
	}



render () {
	return (
			<div>
			<h1>Login to Hoc-Editor!</h1>
			<input onChange={e => this.onUsnChange(e)} className="field" placeholder="name"/>
			<input onChange={e => this.onPassChange(e)} type="password" className="field" placeholder="password"/>
			<button onClick={() => this.onRegister()} className="btn">Register</button>
			<button onClick={() => this.onLogin()} className="btn">Login</button>

			</div>
	);
}

};

export default Login
