import PropTypes from 'prop-types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import apiService from '@/services/api.service';
import DialogDelete from '@/components/dialog-delete';
import { toast } from '@/hooks/use-toast';
import UpdateQuota from './update-quota';
import { z } from 'zod';

const VehicleTypesTable = ({ data, refetch }) => {
  const handleDelete = async (id) => {
    try {
      const response = await apiService.delete(`/vehicle-types/delete/${id}`);
      if (response.data.status === 200) {
        toast({
          title: 'Success',
          description: response.data.message,
          variant: 'default',
        })
        refetch();
      } else {
        toast({
          title: "Failed",
          description: response.data.message || "Something went wrong",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Failed",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  }
  return (
    <div className="rounded-md border border-gray-700 overflow-hidden max-w-[1200px] mx-auto bg-gray-800 shadow-lg">
      <Table>
        <TableHeader className="bg-gray-800">
          <TableRow className="border-b border-gray-700 hover:bg-gray-800/60">
            <TableHead className="p-3 text-base font-semibold text-teal-400">Vehicle Type</TableHead>
            <TableHead className="p-3 text-base font-semibold text-teal-400">Fuel Type</TableHead>
            <TableHead className="p-3 text-base font-semibold text-teal-400">Default Quota</TableHead>
            <TableHead className="p-3 text-base font-semibold text-teal-400 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id} className="border-b border-gray-700 hover:bg-gray-700/30">
              <TableCell className="p-3 text-base font-medium text-white">{item.vehicleType}</TableCell>
              <TableCell className="p-3 text-base text-gray-200">{item.fuelType}</TableCell>
              <TableCell className="p-3 text-base text-gray-200">{item.defaultQuota}</TableCell>
              <TableCell className="p-3 text-right">
                <div className="flex justify-end gap-2">
                  <UpdateQuota id={item.id} quota={item.defaultQuota} refetch={refetch} />
                  <DialogDelete onDelete={() => handleDelete(item.id)} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

VehicleTypesTable.propTypes = {
  data: PropTypes.array.isRequired,
  refetch: PropTypes.func.isRequired,
};

export default VehicleTypesTable;
