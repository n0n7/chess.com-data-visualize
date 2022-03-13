import React from 'react'

import GameStatsChart from './GameStatsChart'

const checkValid = (userStats) => {
    if (!('username' in userStats)) {
        return false
    }

    return true
}

export default function DisplayUser({ userStats }) {

    if (!checkValid(userStats)) {
        return <></>
    }

    return (
    <div id='user-stats'>
        <p id="display-username">username : {userStats.username}</p>
        <div className="doughnut-chart-container">
            <GameStatsChart 
            timeControl={'blitz'}
            data={userStats.chess_blitz}
            />
            <GameStatsChart 
            timeControl={'rapid'}
            data={userStats.chess_rapid}
            />
            <GameStatsChart 
            timeControl={'bullet'}
            data={userStats.chess_bullet}
            />
        </div>
    </div>
    )
}