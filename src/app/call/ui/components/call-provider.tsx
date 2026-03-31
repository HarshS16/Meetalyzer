"use client";

import { Loader2Icon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { generateAvatarUri } from "@/lib/avatar";
import { CallConnect } from "./call-connect";

interface Props {
    meetingId: string;
    meetingName: string;
}

export const CallProvider = ({ meetingId, meetingName }: Props) => {
    const { data, isPending } = authClient.useSession();

    if (!data || isPending) {
        return (
            <div className="flex h-screen items-center justify-center radial-glow-bg">
                <div className="flex flex-col items-center gap-4">
                    <Loader2Icon className="animate-spin size-8 text-primary" />
                    <p className="text-sm text-gray-400">Connecting to call...</p>
                </div>
            </div>
        )
    }

    return (
        <CallConnect
            meetingId={meetingId}
            meetingName={meetingName}
            userId={data.user.id}
            userName={data.user.name}
            userImage={
                data.user.image ?? 
                generateAvatarUri({ 
                    seed: data.user.name, 
                    variant: "initials" 
                })
            }
        />
    )
}