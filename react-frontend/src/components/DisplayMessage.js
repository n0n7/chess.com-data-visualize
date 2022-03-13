import React from 'react'

export default function DisplayMessage({ displayMessage }) {
    switch(displayMessage.type) {
        case 'None':
            return <></>

        case 'Error':
            return (
                <p className='message error'>{displayMessage.text}</p>
            )

        case 'Loading':
            return (
                <p className='message loading'>{displayMessage.text}</p>
            )

        default:
            return <></>
    }
}
