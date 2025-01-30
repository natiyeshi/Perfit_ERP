import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import axios from "@/lib/axios";
import { filterInf } from "../_components/Filter";
import { IDBCompetitor } from "@/types/ICompetitor";
import toast, { Toaster } from "react-hot-toast";

export const useCompetitorTable = () => {
  const [filters, setFilters] = useState<filterInf>({
    name: "",
  });
  let toastId = "";
  const [competitors, setCompetitors] = useState<IDBCompetitor[]>([]);
  const [competitorsData, setCompetitorsData] = useState<IDBCompetitor[]>([]);

  const filter = (name: string, value: any) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const nameFilter = (data: IDBCompetitor) => {
    return (
      filters.name.length === 0 ||
      (data.name && data.name.toLowerCase().includes(filters.name)) ||
      (data.email && data.email.toLowerCase().includes(filters.name))
    );
  };

  const statusFilter = (data: IDBCompetitor) => {
    return (
      filters.status == null ||
      data.name?.toLowerCase() === filters.status.toLowerCase()
    );
  };

  const query = useQuery("competitors", () => axios.get("/competitors"), {
    onSuccess(data) {
      setCompetitors(data.data.result);
      setCompetitorsData(data.data.result);
    },
    onError(err) {
      console.log(err, "EEEEEEEEEEEEEEEEEE ");
    },
  });

  const reload = async () => {
    query.refetch();
  };

  useEffect(() => {
    setCompetitors(() => {
      return competitorsData.filter(
        (data) => nameFilter(data) && statusFilter(data)
      );
    });
  }, [filters, competitorsData]);

  return {
    filters,
    competitors,
    setFilters,
    filter,
    reload,
    query,
  };
};
