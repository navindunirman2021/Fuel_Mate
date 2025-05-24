import Loading from "@/components/loading";
import StationTable from "./station-table";
import apiService from "@/services/api.service";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";

const StationList = () => {
  const { data: stations, isLoading, refetch } = useQuery({
    queryKey: ["stations"],
    queryFn: () => apiService.get("/fuelstation/all"),
  });
  return (
    <div className="max-w-[1000px] mx-auto space-y-6 text-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-teal-400">Stations List</h1>
                
      </div>
      {isLoading ? <Loading /> : <StationTable stations={stations?.data?.data || []} refetch={refetch} />}
    </div>
  );
};

export default StationList;
