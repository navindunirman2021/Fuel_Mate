import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import PropTypes from 'prop-types'
import { alert } from '@/lib/alert';
import { useMutation } from '@tanstack/react-query';
import apiService from '@/services/api.service';
import DialogDelete from '@/components/dialog-delete';
import Loading from '@/components/loading';


const EmployeeTable = ({ data: employees, isLoading, refetch }) => {

  const { mutate } = useMutation({
    mutationKey: ["delete-employee"],
    onSuccess: () => {
      alert.success("Employee deleted successfully");
      refetch();
    },
    onError: (error) => {
      alert.error(error.response.data.message || "Something went wrong");
    },
    mutationFn: (employeeId) => apiService.delete(`/employee/delete/${employeeId}`),
  })
  const handleEdit = (employeeId) => {
    console.log("Edit employee:", employeeId);
  };

  return (
    isLoading ? <Loading /> :
      <div className="rounded-md border border-gray-700 overflow-hidden max-w-[1200px] mx-auto bg-gray-800 shadow-lg">
        <Table>
          <TableHeader className="bg-gray-800">
            <TableRow className="border-b border-gray-700 hover:bg-gray-800/60">
              <TableHead className="p-3 text-base font-semibold text-teal-400">Name</TableHead>
              <TableHead className="p-3 text-base font-semibold text-teal-400">Phone</TableHead>
              <TableHead className="p-3 text-base font-semibold text-teal-400">NIC</TableHead>
              <TableHead className="p-3 text-base font-semibold text-teal-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id} className="border-b border-gray-700 hover:bg-gray-700/30">
                <TableCell className="p-3 text-base font-medium text-white">{employee.name}</TableCell>
                <TableCell className="p-3 text-base text-gray-200">{employee.phone}</TableCell>
                <TableCell className="p-3 text-base text-gray-200">{employee.nic}</TableCell>
                <TableCell className="p-3 text-right">
                  <div className="flex justify-end gap-2">
                    <DialogDelete onDelete={() => mutate(employee.id)} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
  );
};

EmployeeTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    phone: PropTypes.string,
    nic: PropTypes.string,
  })).isRequired,
  isLoading: PropTypes.bool,
  refetch: PropTypes.func
}

export default EmployeeTable;