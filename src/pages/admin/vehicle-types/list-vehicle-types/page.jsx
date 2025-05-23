import VehicleTypesTable from "./vehicle-types-table";
import { useQuery } from "@tanstack/react-query";
import apiService from "@/services/api.service";
import Loading from "@/components/loading";
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ListVehicleTypes = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["vehicle-types"],
    queryFn: () => apiService.get("/vehicle-types/view"),
  });
  return (
    <div className="max-w-[1200px] mx-auto space-y-6 text-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-teal-400">Vehicle Types</h1>
        <Link to="/admin/vehicle-type-add">
          <Button className="bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-2">
            <PlusCircle size={18} />
            Add Vehicle Type
          </Button>
        </Link>
      </div>
      {isLoading ? <Loading /> : <VehicleTypesTable data={data.data.data} refetch={refetch} />}
    </div>
  );
};

export default ListVehicleTypes;
