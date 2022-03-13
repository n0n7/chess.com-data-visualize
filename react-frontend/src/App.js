import React, { useState } from 'react';

import './App.css';
import InputForm from './components/InputForm';
import GraphOverTime from './components/GraphOverTime';
import DisplayUser from './components/DisplayUser';
import DisplayMessage from './components/DisplayMessage';
import axios from 'axios';

function App() {

    const [userStats, setUserStats] = useState({})
    const [ratingOverTimeData, setRatingOverTimeData] = useState({})
    const [username, setUsername] = useState('')
    const [message, setMessage] = useState({text:'', type:'None'})

    function handleSubmit(e) {
        e.preventDefault()

        setMessage({
            text:`Fetching data from user '${username}'`,
            type:'Loading',
        })

        console.log('getting data')
        axios.get(`http://localhost:8000/api?username=${username}`, {
            headers: {
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Methods':'GET,PUT',
            }
        })
        .then((res) => {
            console.log(res.data)
            if(res.data.status === 201) {
                setRatingOverTimeData(res.data.data.rating_over_time)
                setUserStats(res.data.data.user_stats)
                setMessage({
                    text:'',
                    type:'None'
                })
            } else {
                console.log(`can't find player`)
                setMessage({
                    text:res.data.message,
                    type:'Error'
                })
            }
        })
        .catch((err) => {
            console.log(err)
            setMessage({
                text:'501: Internal Server Error',
                type:'Error'
            })
        })
    }

    function handleChange(e) {
        const username = e.target.value
        setUsername(username)
    }


    return (
        <>
        <InputForm 
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        />
        <div id='display-message'>
        <DisplayMessage 
        displayMessage={message}
        />
        </div>
        <DisplayUser 
        userStats={userStats}
        />
        <div id='time-graph'>
            <GraphOverTime
            data = {ratingOverTimeData} 
            />  
        </div>
        </>
    );
}

export default App;
