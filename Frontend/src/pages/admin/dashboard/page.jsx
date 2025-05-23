import Loading from "@/components/loading"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import apiService from "@/services/api.service"
import { useQuery } from "@tanstack/react-query"
import {
    UserIcon,
    Building2,
    Car,
    Fuel
} from "lucide-react"
import { Overview } from "./overview"
import { RecentActivity } from "./quota"

export default function Dashboard() {
    const { data, isLoading } = useQuery({
        queryKey: ["dashboard"],
        queryFn: () => apiService.get("/report/dashboard")
    })

    const dashboardData = data?.data?.data;

    return (
        isLoading ? <Loading /> : <div className="space-y-6 text-white max-w-[1200px] mx-auto">
            <div className="mt-2">
                <h1 className="text-4xl font-bold text-teal-400">Dashboard</h1>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-gray-800 border-gray-700 shadow-lg hover:shadow-xl transition-shadow p-4">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 rounded-full bg-teal-900/30">
                            <Fuel className="h-10 w-10 text-teal-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400 mb-1">Today Used Fuel</p>
                            <h3 className="text-3xl font-bold text-white">{dashboardData.todayUsedFuelAmount} L</h3>
                        </div>
                    </div>
                </Card>

                <Card className="bg-gray-800 border-gray-700 shadow-lg hover:shadow-xl transition-shadow p-4">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 rounded-full bg-teal-900/30">
                            <Building2 className="h-10 w-10 text-teal-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400 mb-1">Total Stations</p>
                            <h3 className="text-3xl font-bold text-white">{dashboardData.station}</h3>
                        </div>
                    </div>
                </Card>

                <Card className="bg-gray-800 border-gray-700 shadow-lg hover:shadow-xl transition-shadow p-4">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 rounded-full bg-teal-900/30">
                            <UserIcon className="h-10 w-10 text-teal-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400 mb-1">Total Employees</p>
                            <h3 className="text-3xl font-bold text-white">{dashboardData.employee}</h3>
                        </div>
                    </div>
                </Card>

                <Card className="bg-gray-800 border-gray-700 shadow-lg hover:shadow-xl transition-shadow p-4">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 rounded-full bg-teal-900/30">
                            <Car className="h-10 w-10 text-teal-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400 mb-1">Total Vehicles</p>
                            <h3 className="text-3xl font-bold text-white">{dashboardData.vehicle}</h3>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 bg-gray-800 border-gray-700 shadow-lg">
                    <CardHeader className="border-b border-gray-700 pb-3 pt-4 px-4">
                        <CardTitle className="text-2xl font-bold text-teal-400">
                            <span className="block">Weekly Overview</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 px-4 pb-4">
                        <Overview data={dashboardData.weeklyReport} />
                    </CardContent>
                </Card>

                <Card className="col-span-3 bg-gray-800 border-gray-700 shadow-lg">
                    <CardHeader className="border-b border-gray-700 pb-3 pt-4 px-4">
                        <CardTitle className="text-2xl font-bold text-teal-400">
                            <span className="block">Recent Activity</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 px-4 pb-4">
                        <RecentActivity todayTransaction={dashboardData.todayTransaction} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
} 