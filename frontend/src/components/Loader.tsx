import { Loader2 } from "lucide-react";

export default function Loader() {
    return (
        <div className="flex justify-center items-center w-full">
            <Loader2 className="h-5 w-5 animate-spin text-white" />
        </div>
    );
}
