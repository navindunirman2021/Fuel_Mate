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
import PropTypes from "prop-types";
import apiService from "@/services/api.service";
import { toast } from "@/hooks/use-toast";
import DialogDelete from "@/components/dialog-delete";
const UserTable = ({ users, refetch }) => {

  const handleDelete = async (id) => {
    try {
      const response = await apiService.delete(`/user/delete/${id}`);
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
            <TableHead className="p-3 text-base font-semibold text-teal-400">Name</TableHead>
            <TableHead className="p-3 text-base font-semibold text-teal-400">Phone</TableHead>
            <TableHead className="p-3 text-base font-semibold text-teal-400">NIC</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="border-b border-gray-700 hover:bg-gray-700/30">
              <TableCell className="p-3 text-base font-medium text-white">{user.id}</TableCell>
              <TableCell className="p-3 text-base text-gray-200">{user.firstName} {user.lastName}</TableCell>
              <TableCell className="p-3 text-base text-gray-200">{user.phone}</TableCell>
              <TableCell className="p-3 text-base text-gray-200">{user.nic}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

UserTable.propTypes = {
  users: PropTypes.array.isRequired,
  refetch: PropTypes.func.isRequired,
};

export default UserTable;
