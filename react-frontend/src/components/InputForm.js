import React from 'react'

export default function InputForm({ handleChange, handleSubmit }) {

  return (
    <>
        <form className="input-form">
            <label className="label username-label">SEARCH</label>
            <input type="text" id="username-input" name="username" onChange={handleChange}/>
            <button id="submit-button" onClick={handleSubmit}>Submit</button>
        </form></>
  )
}