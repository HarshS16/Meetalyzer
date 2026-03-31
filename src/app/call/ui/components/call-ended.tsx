import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircleIcon } from "lucide-react";

export const CallEnded = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full radial-glow-bg">
            <div className="py-4 px-4 md:px-8 flex flex-1 items-center justify-center w-full max-w-md">
                <div className="flex flex-col items-center justify-center gap-y-6 glass-strong border border-primary/30 rounded-2xl p-6 md:p-10 shadow-2xl shadow-black/50 w-full">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 border-2 border-primary/50">
                        <CheckCircleIcon className="size-8 text-primary" />
                    </div>
                    <div className="flex flex-col gap-y-2 text-center">
                        <h6 className="text-xl md:text-2xl font-bold text-white">
                            Call Ended
                        </h6>
                        <p className="text-sm text-gray-400">
                            Your meeting summary will be ready in a few minutes
                        </p>
                    </div>
                    <Button 
                        asChild
                        className="w-full bg-primary hover:bg-primary/90 text-background font-medium shadow-lg shadow-primary/20"
                    >
                        <Link href="/dashboard/meetings">
                            Back to Meetings
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}