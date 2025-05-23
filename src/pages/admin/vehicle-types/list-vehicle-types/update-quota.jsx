import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { alert } from '@/lib/alert'
import apiService from '@/services/api.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Edit } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import React from 'react'

const schema = z.object({
    quota: z.coerce.number().min(1, { message: "Quota must be at least 1." }),
});

const UpdateQuota = ({ id, quota, refetch }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            quota: quota
        }
    });

    const [open, setOpen] = React.useState(false);

    const { mutate: updateQuota, isPending } = useMutation({
        mutationFn: (data) => apiService.put(`/vehicle-types/change-quota/${data.id}`, data),
        onSuccess: () => {
            alert.success("Quota updated successfully");
            setOpen(false);
            reset();
            refetch();
        },
        onError: () => {
            alert.error("Failed to update quota");
        }
    });

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-gray-700 text-teal-400 hover:text-teal-300">
                    <Edit className="h-5 w-5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-gray-800 border-gray-700 text-white">
                <DialogHeader>
                    <DialogTitle className="text-xl text-teal-400">Update Quota</DialogTitle>
                    <DialogDescription className="text-gray-300">
                        Update the quota for this vehicle type.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="quota" className="text-base font-medium text-white">
                            Quota Amount
                        </Label>
                        <Input 
                            id="quota" 
                            type="number" 
                            {...register("quota")} 
                            className="bg-gray-700 border-gray-600 text-white p-3 text-base focus-visible:ring-teal-500 h-12"
                            placeholder="Enter new quota value"
                        />
                        {errors.quota && <p className="text-red-400 text-base">{errors.quota?.message}</p>}
                    </div>
                </div>
                <DialogFooter>
                    <Button 
                        loading={isPending} 
                        type="submit" 
                        onClick={handleSubmit(payload => updateQuota({ id, defaultQuota: payload.quota }))}
                        className="bg-teal-600 hover:bg-teal-700 text-white"
                    >
                        Save changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default UpdateQuota