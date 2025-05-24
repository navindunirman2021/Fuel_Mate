import PropTypes from 'prop-types'
import { Avatar } from "@/components/ui/avatar"
import { Car } from 'lucide-react'

export function RecentActivity({ todayTransaction }) {
    todayTransaction = todayTransaction.slice(0, 5)
    return (
        <div className="space-y-3">
            {todayTransaction.map((activity, index) => (
                <div className="flex items-center p-2 rounded-lg hover:bg-gray-700/40 transition-colors" key={index}>
                    <Avatar className="h-10 w-10 bg-teal-900/30 flex items-center justify-center rounded-full border border-teal-700">
                        <Car className='h-5 w-5 text-teal-400' />
                    </Avatar>
                    <div className="ml-3 space-y-1 flex-1">
                        <p className="text-base font-medium text-white leading-tight capitalize">
                            {activity.vehicle.vehicleType.vehicleType}: {activity.vehicle.vehicleRegistrationPart1 + " " + activity.vehicle.vehicleRegistrationPart2}
                        </p>
                        <p className="text-sm text-gray-400 first-letter:capitalize">
                            Pumped <span className="text-teal-400 font-medium">{activity.pumpedQuantity}L</span> of {activity.vehicle.vehicleType.fuelType.toLowerCase()} by {activity.employee.name}
                        </p>
                    </div>
                    <div className="font-medium text-gray-300 text-xs">{activity.time}</div>
                </div>
            ))}
            
            {todayTransaction.length === 0 && (
                <div className="text-center py-6 text-gray-400">
                    <p className="text-base">No transactions recorded today</p>
                </div>
            )}
        </div>
    )
}

RecentActivity.propTypes = {
    todayTransaction: PropTypes.arrayOf(PropTypes.object).isRequired
}

