import apiService from '@/services/api.service';
import EmployeeTable from './employee-table';
import { useQuery } from '@tanstack/react-query';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ListEmployee = () => {
    const { data: employees, isLoading: isLoadingEmployees, refetch } = useQuery({
        queryKey: ["employees"],
        queryFn: () => apiService.get("/employee/all"),
        retry: false
    });
    return (
        <div className="max-w-[1200px] mx-auto space-y-6 text-white">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold text-teal-400">Employee List</h1>
                <Link to="/admin/employee-add">
                    <Button className="bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-2">
                        <PlusCircle size={18} />
                        Add Employee
                    </Button>
                </Link>
            </div>
            <EmployeeTable data={employees?.data?.data || []} isLoading={isLoadingEmployees} refetch={refetch} />
        </div>
    );
};

export default ListEmployee; 