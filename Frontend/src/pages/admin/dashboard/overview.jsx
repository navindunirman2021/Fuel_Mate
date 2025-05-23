import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import PropTypes from 'prop-types';

const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

export function Overview({ data }) {
    const todayIndex = new Date().getDay();
    const tomorrow = daysOfWeek[(todayIndex + 1) % 7];
    const indexOfTomorrow = daysOfWeek.indexOf(tomorrow);
    const chartData = [];
    for (let i = 0; i < 7; i++) {
        const day = daysOfWeek[(indexOfTomorrow + i) % 7];
        const d = {
            name: day.charAt(0).toUpperCase() + day.slice(1),
            total: data[day]
        }
        chartData.push(d);
    }
    return (
        <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <XAxis 
                    dataKey="name" 
                    stroke="#94a3b8" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    tickMargin={8}
                />
                <YAxis
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}L`}
                    tickMargin={8}
                />
                <Bar 
                    dataKey="total" 
                    fill="#14b8a6" 
                    radius={[4, 4, 0, 0]} 
                    barSize={30}
                />
            </BarChart>
        </ResponsiveContainer>
    )
}

Overview.propTypes = {
    data: PropTypes.object.isRequired
}