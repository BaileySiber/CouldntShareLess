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
      usn: e.target.value
    })
  }

  onPassChange = (e) => {
    this.setState({
      password: e.target.value
    })
  }

  onRepeatChange = (e) => {
    this.setState({
      repeat: e.target.value
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
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff'
  			}}>
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
				margin: '20px',
				paddingTop: '50px',
        paddingBottom: '50px',
        paddingLeft: '200px',
        paddingRight: '200px'
			}}>

        <h1>Register!</h1>
        <br/>
          <br/>
            <br/>
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
        <input onChange={e => this.onRepeatChange(e)} type="password" placeholder="repeat password"/>
        </div>
        <br/>
        <br/>
          <br/>
            <br/>
        <button onClick={() => this.onRegister()} style={{
					backgroundColor: '#c6b8ce',
          paddingTop: '10px',
          paddingBottom: '10px',
          paddingRight: '35px',
          paddingLeft: '35px',
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
    </div>
    )
  }

}


export default Register
