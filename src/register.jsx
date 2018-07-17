import React from 'react';


class Register extends React.Component {
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


  onRegister = () => {
  	fetch (URL + '/register' , {
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
  			this.props.navigate("login")
  		}
  	})
  }

  render() {
    return (
      <div style={{
				display: 'flex',
        fontFamily: "Times New Roman",
				flexDirection: 'column',
				alignItems: 'center',
        color: 'white',
				backgroundColor: '#4C92C7',
				margin: '10px',
				padding: '30px'
			}}>
        <h1>Register!</h1>
        <div>
        <input onChange={e => this.onUsnChange(e)} placeholder="name"/>
        </div>
        <br/>
        <div>
        <input onChange={e => this.onPassChange(e)} type="password" placeholder="password"/>
        </div>
        <br/>
        <button onClick={() => this.onRegister()} style={{
					backgroundColor: '#095997',
          paddingTop: '5px',
          paddingBottom: '5px',
          paddingRight: '20px',
          paddingLeft: '20px',
          borderRadius: '12px',
          border: 'none',
          color: 'white',
					fontFamily: "Times New Roman",
					textAlign: 'center',
					display: 'inline-block',
					fontSize: '14px',
					margin: '10px'
				}}>Register</button>
      </div>
    )
  }

}

export default Register
