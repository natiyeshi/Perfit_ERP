"use client";

import React from "react";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  CartesianGrid,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const data = [
  {
    name: "Active",
    status: 2000,
  },
  {
    name: "Inactive",
    status: 2400,
  },
];

const Gender = () => {
  return (
    <ResponsiveContainer width="90%" height="80%" className={"mt-5 mx-auto "}>
      <BarChart width={150} height={40} data={data}>
        <Bar dataKey="status" barSize={100} fill="#38fc7e" />
        <CartesianGrid
          strokeDasharray="3 2"
          vertical={false}
          horizontal={false}
        />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip labelClassName="text-black " cursor={false} />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Gender;
