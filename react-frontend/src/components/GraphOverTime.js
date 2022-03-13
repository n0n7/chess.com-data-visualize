import 'chartjs-adapter-date-fns'; 
import React from 'react'
const { Line } = require('react-chartjs-2')
const { Chart, registerables  } = require('chart.js')

// using magic to prevent crash
Chart.register(...registerables)

const checkDataValid = (data) => {

    if (data === undefined) {
        return false
    }
    
    const mustHaveProperty = [
        'blitz',
        'rapid',
        'bullet'
    ]
    
    for (const property of mustHaveProperty) {
        if (!(property in data)) {
            return false
        }
    }

    return true
}

export default function GraphOverTime({ data }) {

    const options = {
        title: {
            display: true,
            text: 'test',
        },
        layout: {
            padding: 20
        },
        scales: {
            x: {
                type: 'time',
                distribution: 'linear',
                time: {
                    stepSize: 1,
                }
            },
        },
        
    }

    if (checkDataValid(data)) {

        return (
            <Line
                // datasetIdKey='id'
                data={{
                    datasets: [
                        {
                            label:"blitz",
                            data:data.blitz,
                            backgroundColor: 'rgba(125, 99, 132, 0.5)',
                            borderColor: 'rgb(125, 99, 132)',
                            radius: 0,
                            borderWidth: 2,
                            tension: 0,
                            stepped: true,
                        },
                        {
                            label:"rapid",
                            data:data.rapid,
                            backgroundColor: 'rgba(255, 0, 0, 0.5)',
                            borderColor: 'rgb(255, 0, 0)',
                            radius: 0,
                            borderWidth: 2,
                            stepped: true,
                        },
                        {
                            label:"bullet",
                            data:data.bullet,
                            backgroundColor: 'rgba(10, 255, 132, 0.5)',
                            borderColor: 'rgb(10, 255, 132)',
                            radius: 0,
                            borderWidth: 2,
                            stepped: true,
                        }
                    ]
                }}
                options={options}
            />
        )
    }
    else {
        return <></>
    }
}
