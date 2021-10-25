import React, { useState, useRef, useCallback } from 'react';
import { PieChart, Pie, Sector, ResponsiveContainer, Cell } from 'recharts';

export default function PieChartComponent(props) {

    const COLORS = ['#00ab9e', '#f6944a', '#bdcd28', '#fec010'];

    const [pieState, setPieState] = useState({ activeIndex: 0 })

    const smallPie = useRef(props.small)


    const onPieEnter = (_, index) => {
        setPieState(prevState => ({ ...prevState, 'activeIndex': index }))
    };


    const renderActiveShape = useCallback((props) => {
        const RADIAN = Math.PI / 180;
        const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
        const sin = Math.sin(-RADIAN * midAngle);
        const cos = Math.cos(-RADIAN * midAngle);
        const sx = cx + (outerRadius + 10) * cos;
        const sy = cy + (outerRadius + 10) * sin;
        const mx = cx + (outerRadius + (smallPie.current ? 15 : 30)) * cos;
        const my = cy + (outerRadius + (smallPie.current ? 15 : 30)) * sin;
        const ex = mx + (cos >= 0 ? 1 : -1) * 22;
        const ey = my;
        const textAnchor = cos >= 0 ? 'start' : 'end';



        return (
            <g>
                <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} style={{ fontSize: smallPie.current ? window.innerWidth > 1700 ? '0.65rem' : '0.5rem' : window.innerWidth > 1700 ? '1rem' : '0.75rem' }}>
                    {payload.name}
                </text>
                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                />
                <Sector
                    cx={cx}
                    cy={cy}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    innerRadius={outerRadius + 6}
                    outerRadius={outerRadius + 10}
                    fill={fill}
                />
                <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
                <circle cx={ex} cy={ey} r={2} fill={`#000`} stroke="#eee" />
                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill={fill} style={{ fontSize: smallPie.current ? window.innerWidth > 1700 ? '1rem' : '0.75rem' : window.innerWidth > 1700 ? '1.3rem' : '1rem' }}>
                    {`PV ${value}`}
                </text>
                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill={fill} style={{ fontSize: smallPie.current ? window.innerWidth > 1700 ? '0.65rem' : '0.5rem' : window.innerWidth > 1700 ? '1rem' : '0.75rem' }}>
                    {`(Rate ${(percent * 100).toFixed(2)}%)`}
                </text>
            </g>
        );
    }
        , [])




    return (
        <ResponsiveContainer width={props.width || '100%'} height={props.height || '100%'}>
            <PieChart width={400} height={400}>
                <Pie
                    activeIndex={pieState.activeIndex}
                    activeShape={renderActiveShape}
                    data={props.data} // array of object with keys name and value (string and int)
                    cx="50%"
                    cy="50%"
                    innerRadius={smallPie.current ? window.innerWidth > 1700 ? 50 : 40 : window.innerWidth > 1700 ? 80 : 60}
                    outerRadius={smallPie.current ? window.innerWidth > 1700 ? 70 : 60 : window.innerWidth > 1700 ? 100 : 80}
                    dataKey="value"
                    onMouseEnter={onPieEnter}
                >
                    {props.data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>

            </PieChart>
        </ResponsiveContainer>
    );
}
