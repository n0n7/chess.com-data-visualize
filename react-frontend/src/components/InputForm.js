import React, { useState } from 'react'
import axios from "axios";

export default function InputForm() {

    const [username, setUsername] = useState('')

    function handleSubmit(e) {
        e.preventDefault()
        console.log('getting data')
        axios.get(`/api?username=${username}`)
        .then((res) => {
            console.log(res.data)
        })
        .catch((err) => console.log(err))

        // return (<Navigate to={"https://www.google.co.th/"}/>)
    }

    function handleChange(e) {
        const username = e.target.value
        setUsername(username)
    }

  return (
    <>
        <form className="input-form">
            <label className="label username-label">SEARCH</label>
            <input type="text" id="username-input" name="username" onChange={handleChange}/>
            <button id="submit-button" onClick={handleSubmit}>Submit</button>
        </form></>
  )
}
