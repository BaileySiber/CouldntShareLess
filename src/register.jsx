import React from 'react';


class Register extends React.Component {
  constructor() {
    super()
    this.state = {
      usn: "",
      password: ""
    }
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
        backgroundColor: 'blue'
      }}>
        <h1>Register!</h1>
        <input onChange={e => this.onUsnChange(e)} className="field" placeholder="name"/>
        <input onChange={e => this.onPassChange(e)} type="password" className="field" placeholder="password"/>
        <button onClick={() => this.onRegister()} className="btn">Register</button>
      </div>
    )
  }

}

export default Register
