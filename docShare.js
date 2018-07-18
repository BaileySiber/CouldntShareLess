import React from "react";

export default class SharedDoc extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      docPassword:"",
      docId: ""
    }
  }

//when opening different document --> run this code
  componentDidMount() {
    //be able to join the document edit
    //redirect to the document
    fetch("", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        password: this.state.docPassword
      })
    })
    .then(response => response.json())
    .then(json => {
      if(json.status === 200){
        console.log('idk what this does ugh')
      }else{

      }
    }
  })
}

  render() {
    return (
      <div>

      </div>
    )
  }


}
}
