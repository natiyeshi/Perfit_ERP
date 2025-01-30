"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { subMonths, isAfter } from "date-fns";
import Filter from "./Filter";
import { useQuery } from "react-query";
import axios from "@/lib/axios";
import { IDBPopulatedImport } from "@/types/IImport";
import toast from "react-hot-toast";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

type TimeChoice =
  | "all"
  | "last month"
  | "last 3 months"
  | "last 6 months"
  | "this 12 months";

export type TopCompetitorFilterState = {
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

const TopImporters = ({
  importsData,
  query,
}: {
  importsData: IDBPopulatedImport[];
  query: any;
}) => {
  const [filter, setFilter] = useState<TopCompetitorFilterState>({
    time: "all",
  });
  const [chartData, setChartData] = useState<ChartData[]>([]);

  const getChartData = () => {
    const monthAgo = subMonths(new Date(), timeChoices[filter.time]);
    let datas: Record<string, number> = {};

    importsData.forEach((d) => {
      const createdAt = new Date(d.createdAt);
      if (!datas[d.competitorId]) {
        datas[d.competitor.name ?? "unkown"] = 0;
      }
      if (filter.time === "all" || isAfter(createdAt, monthAgo)) {
        datas[d.competitor.name ?? "unkown"] += d.quantity;
      }
    });

    const sortedData = Object.entries(datas)
      .sort(([, a], [, b]) => b - a)
      .map(([key, value]) => ({ name: key, value }));

    let topFour = sortedData.slice(0, 4);

    setChartData(topFour);
  };

  useEffect(() => {
    getChartData();
  }, [filter, query.isSuccess,importsData]);

  return (
    <div className="w-full h-[70vh]">
      <h3 className="text-xl text-center mb-1">Top Importers</h3>
      <h3 className="text-sm text-center mb-2">importers list</h3>
      <div className="flex justify-end w-full">
        {typeof window !== "undefined" && (
          <Filter filter={filter} setFilter={setFilter} />
        )}
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopImporters;
