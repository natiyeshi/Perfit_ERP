"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import importDataDummy from "@/data/importDummyData";
import { subMonths, isAfter } from "date-fns";
import Filter from "./Filter";

export interface SoldfilterInf {
  time:
    | "all"
    | "last month"
    | "last 3 months"
    | "last 6 months"
    | "this 12 months";
  numOfBars: number;
  sortType: "quantity" | "total_price";
  displayType: "product_brand" | "product_name";
}

const timeChoices = {
  all: 10,
  "last month": 1,
  "last 3 months": 3,
  "last 6 months": 6,
  "this 12 months": 12,
};

const MostSold: React.FC = () => {
  // Get the last three months' date

  const [filter, setFilter] = useState<SoldfilterInf>({
    time: "all",
    numOfBars: 6,
    sortType: "quantity",
    displayType: "product_brand",
  });
  const [chartData, setChartData] = useState<any>([]);

  const getChartData = () => {
    const monthAgo = subMonths(new Date(), timeChoices[filter.time]);
    let datas: any = {};
    const set = new Set();
    importDataDummy.map((d) => {
      const orderDate = new Date(d.order_date);
      if (!set.has(d[filter.displayType])) {
        datas[d[filter.displayType]] = 0;
        set.add(d[filter.displayType]);
      }
      if (filter.time == "all" || isAfter(orderDate, monthAgo)) {
        datas[d[filter.displayType]] += d[filter.sortType];
      }
    });
    const sortedByValue = Object.fromEntries(
      Object.entries(datas).sort(
        ([, valueA]: any, [, valueB]: any) => valueB - valueA
      )
    );
    const result = Object.entries(sortedByValue).map(([key, value]) => ({
      [filter.displayType]: key,
      [filter.sortType]: value,
    }));
    if (filter.numOfBars > result.length - 1) {
      setChartData(result.slice(0, filter.numOfBars - 1));
      return;
    }
    const LastValue = result.slice(0, filter.numOfBars - 1);
    let restValue = 0;
    result.slice(filter.numOfBars - 1, result.length).map((d: any) => {
      restValue += d[filter.sortType];
    });
    LastValue.push({
      [filter.displayType]: "Others",
      [filter.sortType]: restValue,
    });
    setChartData(LastValue);
  };
  useEffect(() => {
    getChartData();
  }, [filter]);

  return (
    <div className="w-full h-[70vh]">
      <h3 className="big-topic text-center mb-4 pt-6 ">Import Data </h3>
      <div className="flex justify-end w-full">
        <Filter filter={filter} setFilter={setFilter} />
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <YAxis type="number" />
          <XAxis type="category" dataKey={filter.displayType} width={150} />
          <Tooltip cursor={false} />
          <Bar dataKey={filter.sortType} fill="#38fc7e" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MostSold;
