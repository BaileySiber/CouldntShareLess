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
			<div style={{
				display: 'flex',
				flexDirection: 'column',
				fontFamily: "Times New Roman",
				backgroundColor: '#4C92C7',
				alignItems: 'center',
				margin: '10px',
				color: 'white',
				padding: '30px'
			}}>
			<div><h1>Login to Hoc-Editor!</h1></div>
			<div>
				<input onChange={e => this.onUsnChange(e)} placeholder="name"/>
			</div>
			<br/>
			<div>
				<input onChange={e => this.onPassChange(e)} type="password" placeholder="password"/>
			</div>
			<br/>
			<div>
				<button onClick={() => this.onLogin()} style={{
					backgroundColor: '#095997',
					paddingTop: '5px',
					paddingBottom: '5px',
					paddingRight: '20px',
					paddingLeft: '20px',
					color: 'white',
					borderRadius: '12px',
					border: 'none',
					fontFamily: "Times New Roman",
					textAlign: 'center',
					display: 'inline-block',
					fontSize: '14px',
					margin: '10px'
				}}>Login</button>
			</div>
			<div>
				<button onClick={() => this.onRegister()} style={{
					backgroundColor: '#095997',
					paddingTop: '5px',
					paddingBottom: '5px',
					paddingRight: '20px',
					paddingLeft: '20px',
					borderRadius: '12px',
					color: 'white',
					border: 'none',
					fontFamily: "Times New Roman",
					textAlign: 'center',
					display: 'inline-block',
					fontSize: '14px',
				}}>Register</button>
			</div>

		</div>
	);
}

};

export default Login
