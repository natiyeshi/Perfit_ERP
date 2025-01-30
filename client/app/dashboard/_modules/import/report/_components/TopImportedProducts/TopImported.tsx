"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { subMonths, isAfter } from "date-fns";
import Filter from "./Filter";
import { useQuery } from "react-query";
import axios from "@/lib/axios";
import React, { useEffect, useState } from "react";
import { IDBClientImport, IDBPopulatedImport } from "@/types/IImport";
import toast, { Toaster } from "react-hot-toast";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

type TimeChoice =
  | "all"
  | "last month"
  | "last 3 months"
  | "last 6 months"
  | "this 12 months";

export type TopImportProductsFilterState = {
  time: TimeChoice;
};

interface ChartData {
  name: string;
  value: number;
}

const timeChoices: Record<TimeChoice, number> = {
  all: 10,
  "last month": 1,
  "last 3 months": 3,
  "last 6 months": 6,
  "this 12 months": 12,
};

const TopImportedProducts = ({
  importsData,
  query,
}: {
  importsData: IDBPopulatedImport[];
  query: any;
}) => {
  const [filter, setFilter] = useState<TopImportProductsFilterState>({
    time: "all",
  });
  const [chartData, setChartData] = useState<ChartData[]>([]);

  const getChartData = () => {
    const monthAgo = subMonths(new Date(), timeChoices[filter.time]);
    let datas: Record<string, number> = {};

    importsData.forEach((d) => {
      const createdAt = new Date(d.createdAt);
      if (!datas[d.product.name]) {
        datas[d.product.name] = 0;
      }
      if (filter.time === "all" || isAfter(createdAt, monthAgo)) {
        datas[d.product.name] += d.quantity;
      }
    });

    const sortedData = Object.entries(datas)
      .sort(([, a], [, b]) => b - a)
      .map(([key, value]) => ({ name: key, value }));

    let topFour = sortedData.slice(0, 4);
    let othersValue = sortedData
      .slice(4)
      .reduce((sum, item) => sum + item.value, 0);
    if (othersValue > 0) {
      topFour.push({ name: "Others", value: othersValue });
    }

    setChartData(topFour);
  };

  useEffect(() => {
    getChartData();
  }, [filter, query.isSuccess,importsData]);

  return (
    <div className="w-full h-[70vh]">
      <h3 className="text-xl text-center mb-1 ">Top Imported Products</h3>
      <h3 className="text-sm text-center mb-2 ">products list</h3>
      <div className="flex justify-end w-full">
        {typeof window !== "undefined" && (
          <Filter filter={filter} setFilter={setFilter} />
        )}
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={150}
            fill="#8884d8"
            label
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopImportedProducts;
