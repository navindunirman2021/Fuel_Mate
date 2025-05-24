import { toast } from "@/hooks/use-toast";

export const alert = {
    success: (message, title = "Success") => {
        toast({
            title: title,
            description: message,
            variant: "default",
            className: "bg-gray-800 border-teal-600 text-white",
        });
    },
    error: (message, title = "Failed") => {
        toast({
            title: title,
            description: message,
            variant: "destructive",
            className: "bg-gray-800 border-red-600 text-white",
        });
    },
    warning: (message, title = "Warning") => {
        toast({
            title: title,
            description: message,
            variant: "default",
            className: "bg-gray-800 border-amber-600 text-white",
        });
    },
    info: (message, title = "Info") => {
        toast({
            title: title,
            description: message,
            variant: "default",
            className: "bg-gray-800 border-blue-600 text-white",
        });
    }
};
