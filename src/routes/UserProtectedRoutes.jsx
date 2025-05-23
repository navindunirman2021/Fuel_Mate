import Loading from "@/components/loading";
import apiService from "@/services/api.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const queryClient = useQueryClient();

    const { data: allData, isLoading } = useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            const response = await apiService.get("/user/authenticate");
            return response.data.data;
        },
        retry: false
    });

    const user = allData?.user;

    if (isLoading) {
        return <Loading />;
    }

    if (!user) {
        queryClient.removeQueries(["user"]);
        return <Navigate to="/login" />;
    }

    if (!user.verified) {
        queryClient.removeQueries(["user"]);
        return <Navigate to="/otp" />;
    }

    if (!allData.vehicleRegistration) {
        queryClient.removeQueries(["user"]);
        return <Navigate to="/vehicle" />;
    }

    return <Outlet user={user} />;
};

export default ProtectedRoute;