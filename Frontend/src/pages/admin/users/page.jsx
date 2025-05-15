import UserTable from "./user-table"
import Loading from "@/components/loading"
import apiService from "@/services/api.service"
import { useQuery } from "@tanstack/react-query"
import { UsersRound } from "lucide-react"

export default function Users() {
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['users'],
        queryFn: () => apiService.get('/user/all'),
    })

    return isLoading ? <Loading /> : (
        <div className="max-w-[1200px] mx-auto space-y-6 text-white">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold text-teal-400 flex items-center gap-2">
                    <UsersRound className="h-7 w-7" />
                    Users
                </h1>
            </div>
            <UserTable users={data?.data.data?.allUsers || []} refetch={refetch} />
        </div>
    )
} 