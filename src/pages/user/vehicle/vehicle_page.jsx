import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import QRCode from 'qrcode';
import apiService from "@/services/api.service";
import { showToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import PropTypes from 'prop-types';
import { useEffect, useState } from "react";
import { alert } from "@/lib/alert";
import Loading from "@/components/loading";

export default function VehiclePage() {
  const [qr, setQr] = useState(null);

  const { data: fetchedVehicleData, loading, refetch } = useQuery({
    queryKey: ['vehicle'],
    queryFn: () => apiService.get('/user/vehicle')
  })

  const { mutate: resetQR, isPending } = useMutation({
    mutationFn: () => apiService.get('/user/reset/qr'),
    onSuccess: () => {
      alert.success('QR code reset successfully');
      refetch();
    },
    onError: () => {
      alert.error('Failed to reset QR code');
    }
  })

  const vehicleData = fetchedVehicleData?.data?.data;

  useEffect(() => {
    getQRCode();
  }, [vehicleData]);


  const getQRCode = async () => {
    const qrData = {
      qrId: vehicleData.vehicle.qrId,
      numberPlate: vehicleData.vehicle.vehicleRegistrationPart1 + " " + vehicleData.vehicle.vehicleRegistrationPart2,
    };
    const qrCodeURL = await QRCode.toDataURL(JSON.stringify(qrData));
    setQr(qrCodeURL);
  }

  const handleQRDownload = async () => {
    try {
      const link = document.createElement('a');
      link.href = qr;
      link.download = `QR_${vehicleData.vehicle.vehicleRegistrationPart1 + " " + vehicleData.vehicle.vehicleRegistrationPart2}.png`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error('Error generating QR code:', error);
      showToast.error('Failed to generate QR code');
    }
  };

  if (loading) return <Loading />;
  if (!vehicleData) return <Loading />;

  return (
    <div className="bg-gray-900 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">Vehicle Information</h1>
        
        <div className="flex flex-col gap-8">
          <Card className="bg-gray-800 border-gray-700 shadow-xl">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-teal-400 mb-6 border-b border-gray-700 pb-3">Your Vehicle</h2>
              <div className="space-y-5">
                <InfoRow label="Name:" value={vehicleData.user.firstName + " " + vehicleData.user.lastName} />
                <InfoRow label="NIC:" value={vehicleData.user.nic} />
                <InfoRow label="Phone Number:" value={vehicleData.user.phone} />
                <InfoRow label="Vehicle Number:" value={vehicleData.vehicle.vehicleRegistrationPart1 + "-" + vehicleData.vehicle.vehicleRegistrationPart2} />
                <InfoRow label="Vehicle Type:" value={vehicleData.vehicle.vehicleType.vehicleType} />
                <InfoRow label="Chassis Number:" value={vehicleData.vehicle.chassisNumber} />
                <InfoRow label="Fuel Type:" value={vehicleData.vehicle.vehicleType.fuelType} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 shadow-xl">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-teal-400 mb-6 border-b border-gray-700 pb-3">Quota Summary</h2>
              <div className="space-y-5">
                <InfoRow label="Available Quota:" value={`${vehicleData.availableQuota} L`} highlight={true} />
                <InfoRow label="Total Quota:" value={`${vehicleData.defaultQuota} L`} />

                <div className="mt-8">
                  <div className="flex justify-between text-gray-300 text-lg mb-2">
                    <span>Quota Used</span>
                    <span>{vehicleData.usedQuota}L / {vehicleData.defaultQuota}L</span>
                  </div>
                  <Progress
                    value={(vehicleData.usedQuota / vehicleData.defaultQuota) * 100}
                    className="h-3 bg-gray-700"
                    indicatorClassName="bg-blue-500"
                  />
                </div>
                
                <div className="flex justify-center items-center mt-8 bg-white p-4 rounded-lg">
                  {qr && <img src={qr} alt="QR Code" className="w-72 h-72" />}
                </div>
                <div className="flex justify-center items-center gap-4 mt-4">
                  <Button
                    onClick={resetQR}
                    loading={isPending}
                    variant="outline"
                    className="text-white border-gray-600 hover:bg-gray-700"
                  >
                    Reset QR
                  </Button>
                  <Button
                    onClick={handleQRDownload}
                    className="bg-teal-600 hover:bg-teal-700"
                  >
                    Download QR
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, highlight }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-gray-700">
      <span className="text-gray-300 text-lg">{label}</span>
      <span className={`font-semibold text-lg ${highlight ? 'text-teal-400' : 'text-white'}`}>{value}</span>
    </div>
  );
}

InfoRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  highlight: PropTypes.bool
};

InfoRow.defaultProps = {
  highlight: false
};

