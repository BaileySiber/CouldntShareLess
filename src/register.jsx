import React from 'react';


class Register extends React.Component {
  constructor() {
    super()
    this.state = {
      usn: "",
      password: "",
      repeat: ""
    }
  }

  onUsnChange = (e) => {
    this.setState({
      usn: event.target.value
    })
  }

  onPassChange = (e) => {
    this.setState({
      password: event.target.value
    })
  }

  onRepeatChange = (e) => {
    this.setState({
      repeat: event.target.value
    })
  }


  onRegister = () => {
  	fetch ('http://localhost:1337/register' , {
  		method: 'POST',
  		headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: this.state.usn,
        password: this.state.password,
        passwordRepeat: this.state.repeat
      })
  	}).then((res) => {
  		if (res.status === 200) {
        console.log('sucess registering')
  			this.props.navigate("login")
  		}
  	}).catch(err => console.log(err))
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
        <div>
        <input onChange={e => this.onRepeatChange(e)} type="password" placeholder="repeat password"/>
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
