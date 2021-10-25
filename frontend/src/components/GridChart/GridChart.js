import React from 'react'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, } from "recharts";


export default function GridChart(props) { //data all1 all2 key1 key2
    return (
        <ResponsiveContainer
            width="100%"
            height="100%"
        >
            <LineChart
                width={500}
                height={400}
                data={props.data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, Math.max(...props.all1, ...props.all2)]} />
                <Tooltip />
                <Legend />
                <Line
                    type="monotone"
                    dataKey={props.key1}
                    stroke="rgb(198 2 36)"
                    activeDot={{ r: 8 }}
                />
                <Line type="monotone" dataKey={props.key2} stroke="#e98300" />
            </LineChart>
        </ResponsiveContainer>
    )
}
