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
				backgroundColor: '#ffffff'
			}}>
		<br/>
			<div style={{
				display: 'flex',
				flexDirection: 'column',
				fontFamily: "Lucida, sans-serif",
				backgroundColor: '#a28baf',    //#ccf2ff
				// borderStyle: 'solid',
				// borderWidth: '3px',
				alignItems: 'center',
				margin: '30px',
				color: 'white',
				paddingBottom: '40px',
				paddingLeft: '100px',
				paddingRight: '100px'
			}}>
				<br/>
					<br/>
		<h1 style={{
				fontSize: '45px'
			}}>Couldn’t Share Less</h1>
				<img style={{height: 150}}	src="./flat.png"/>
				<br/>
				<br/>
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
					backgroundColor: '#c6b8ce',
					paddingTop: '10px',
					paddingBottom: '10px',
					paddingRight: '35px',
					paddingLeft: '35px',
					color: 'white',
					borderRadius: '12px',
					border: 'none',
					fontFamily: "Times New Roman",
					textAlign: 'center',
					display: 'inline-block',
					fontSize: '14px',
					margin: '20px'
				}}>Login</button>

			</div>
			<div>
				<button onClick={() => this.onRegister()} style={{
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
				}}>Register</button>
			</div>
		</div>
	</div>
	);
}

};

export default Login
