import { RadarChart, Radar, PolarAngleAxis, PolarGrid, Legend, Tooltip, ResponsiveContainer } from "recharts";

const RadarChartPlot = ({data}) => {
    // const data = [
    //     {
    //       "day": "Monday",
    //       "amount": 500
    //     },
    //     {
    //       "day": "Tuesday",
    //       "amount": 300
    //     },
    //     {
    //       "day": "Wednesday",
    //       "amount": 240
    //     },
    //     {
    //       "day": "Thursday",
    //       "amount": 230
    //     },
    //     {
    //       "day": "Friday",
    //       "amount": 150
    //     },
    //     {
    //       "day": "Saturday",
    //       "amount": 300
    //     }
    //   ];
  return (
    <>
    <ResponsiveContainer width="100%" height="95%">
      <RadarChart outerRadius={90} width={730} height={250} data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="day" />
        <Radar name="Day" dataKey="transactions" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
        <Legend />
        <Tooltip/>
      </RadarChart>
    </ResponsiveContainer>
  </>
  )
}

export default RadarChartPlot