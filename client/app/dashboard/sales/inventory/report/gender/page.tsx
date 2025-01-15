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
    name: "Male",
    gender: 1000,
  },
  {
    name: "Female",
    gender: 2400,
  },
];

const Gender = () => {
  return (
    <ResponsiveContainer width="90%" height="80%" className={"mt-5 mx-auto "}>
      <BarChart width={150} height={40} data={data}>
        <Bar dataKey="gender" barSize={100} fill="#38fc7e" />
        <CartesianGrid strokeDasharray="3 2" vertical={false} />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip labelClassName="text-black " cursor={false} />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Gender;
