import React from 'react'
const { Doughnut } = require('react-chartjs-2')
const { Chart, registerables  } = require('chart.js')


// using magic to prevent crash
Chart.register(...registerables)

export default function GameStatsChart({ timeControl, data}) {

    if (data === undefined) {
        data = {
            last: {
                rating: 'never played',
            },
            record: {
                loss: 0,
                win: 0,
                draw: 0,
                never_play: 1,
            }
        }
    } else {
        data.record.never_play = 0
    }


    const options = {
        responsive: true, 
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                color: '#000',
                text: `${timeControl} (${data.last.rating})`,
                font: {
                    size: 18,
                  }
            },
            legend: {
                display: false,
            }
        }
    }

    return (
        <div className="doughnut-container">
        <Doughnut 
            data = {{
                datasets: [{
                    data: [data.record.loss, data.record.draw, data.record.win, data.record.never_play],
                    backgroundColor:['rgba(255, 0, 0, 1)', 'rgba(128, 128, 128, 1)', 'rgba(0, 255, 0, 1)', 'rgba(192, 192, 192, 0.5)'],
                    borderWidth: 0,
                }],
                labels: [
                    'Lose',
                    'Draw',
                    'Win',
                    'never played'
                ]
            }}
            options={options}
            />
        </div>
    )
}
