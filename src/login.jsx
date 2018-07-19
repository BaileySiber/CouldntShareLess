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
			usn: e.target.value
		})
	}

	onPassChange = (e) => {
		this.setState({
			password: e.target.value
		})
	}


	onRegister = () => {
		this.props.navigate("register")
	}



	render () {
		return (
			<div style={{
				display: 'flex',
				height: '100%',
				alignItems: 'center',
				justifyContent: 'center',
				backgroundColor: '#095997'
			}}>
			<div style={{
				display: 'flex',
				flexDirection: 'column',
				fontFamily: "Times New Roman",
				backgroundColor: '#4C92C7',
				alignItems: 'center',
				margin: '30px',
				color: 'white',
				padding: '30px'
			}}>
			<div><h1 style={{
				fontSize: '40px'
			}}>Couldn’t Share Less</h1></div>
			<div>
				<input onChange={e => this.onUsnChange(e)} placeholder="name"/>
			</div>
			<br/>
			<div>
				<input onChange={e => this.onPassChange(e)} type="password" placeholder="password"/>
			</div>
			<br/>
			<div>
				<button onClick={() => this.props.onLogin(this.state.usn, this.state.password)} style={{
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
	</div>
	);
}

};

export default Login
