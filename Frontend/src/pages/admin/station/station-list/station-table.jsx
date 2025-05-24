import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PropTypes from "prop-types";
import apiService from "@/services/api.service";
import { toast } from "@/hooks/use-toast";
import DialogDelete from "@/components/dialog-delete";
const StationsTable = ({ stations, refetch }) => {

  const handleDelete = async (id) => {
    try {
      const response = await apiService.delete(`/fuelstation/delete/${id}`);
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
            <TableHead className="p-3 text-base font-semibold text-teal-400">#</TableHead>
            <TableHead className="p-3 text-base font-semibold text-teal-400">Station Name</TableHead>
            <TableHead className="p-3 text-base font-semibold text-teal-400">Owner</TableHead>
            <TableHead className="p-3 text-base font-semibold text-teal-400">Created At</TableHead>
            <TableHead className="p-3 text-base font-semibold text-teal-400 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stations.map((station) => (
            <TableRow key={station.id} className="border-b border-gray-700 hover:bg-gray-700/30">
              <TableCell className="p-3 text-base font-medium text-white">{station.id}</TableCell>
              <TableCell className="p-3 text-base text-gray-200">{station.location}</TableCell>
              <TableCell className="p-3 text-base text-gray-200">{station.ownerName}</TableCell>
              <TableCell className="p-3 text-base text-gray-200">{new Date(station.createdAt).toLocaleDateString()}</TableCell>
              <TableCell className="p-3 text-right">
                <DialogDelete onDelete={() => handleDelete(station.id)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

StationsTable.propTypes = {
  stations: PropTypes.array.isRequired,
  refetch: PropTypes.func.isRequired,
};

export default StationsTable;
