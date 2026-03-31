import { LogInIcon, VideoIcon, MicIcon } from "lucide-react";
import {
    DefaultVideoPlaceholder,
    StreamVideoParticipant,
    ToggleAudioPreviewButton,
    ToggleVideoPreviewButton,
    useCallStateHooks,
    VideoPreview
} from "@stream-io/video-react-sdk";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { generateAvatarUri } from "@/lib/avatar";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import Link from "next/link";

interface Props {
    onJoin: () => void;
}

const DisabledVideoPreview = () => {
    const { data } = authClient.useSession();
    return (
        <DefaultVideoPlaceholder
            participant={
                {
                    name: data?.user.name ?? "",
                    image:
                        data?.user.image ??
                        generateAvatarUri({
                            seed: data?.user.name ?? "",
                            variant: "initials",
                        }),
                } as StreamVideoParticipant
            }
        />
    )
}

const AllowBrowserPermission = () => {
    return (
        <div className="flex flex-col items-center justify-center w-full h-full p-6 md:p-8 text-center gap-4 bg-black/40">
            <div className="flex items-center gap-3">
                <VideoIcon className="size-8 text-primary" />
                <MicIcon className="size-8 text-primary" />
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-sm md:text-base text-white font-medium">
                    Camera and Microphone Access Required
                </p>
                <p className="text-xs md:text-sm text-gray-400 max-w-md">
                    Please grant your browser permission to access your camera and microphone to join the call
                </p>
            </div>
        </div>
    )
}

export const CallLobby = ({ onJoin }: Props) => {
    const { useCameraState, useMicrophoneState } = useCallStateHooks();

    const { hasBrowserPermission: hasMicPermission } = useMicrophoneState();
    const { hasBrowserPermission: hasCameraPermission } = useCameraState();

    const hasBrowserMediaPermission = hasCameraPermission && hasMicPermission;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen radial-glow-bg p-4">
            <div className="w-full max-w-2xl">
                <div className="flex flex-col items-center justify-center gap-y-4 md:gap-y-6 glass-strong border border-primary/30 rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-10 shadow-2xl shadow-black/50">
                    {/* Header */}
                    <div className="flex flex-col gap-y-1.5 md:gap-y-2 text-center">
                        <h6 className="text-lg md:text-xl lg:text-2xl font-bold text-white">
                            Ready to join?
                        </h6>
                        <p className="text-xs md:text-sm text-gray-400">
                            Set up your audio and video before joining
                        </p>
                    </div>

                    {/* Video Preview */}
                    <div className="w-full aspect-video rounded-lg md:rounded-xl overflow-hidden border border-primary/20 bg-black/50 flex items-center justify-center relative [&>div]:w-full [&>div]:h-full [&>div]:flex [&>div]:items-center [&>div]:justify-center [&_.str-video__video-preview-container]:w-full [&_.str-video__video-preview-container]:h-full [&_.str-video__video-preview-container]:flex [&_.str-video__video-preview-container]:items-center [&_.str-video__video-preview-container]:justify-center [&_video]:object-cover [&_video]:w-full [&_video]:h-full">
                        <VideoPreview
                            DisabledVideoPreview={
                                hasBrowserMediaPermission
                                    ? DisabledVideoPreview
                                    : AllowBrowserPermission
                            }
                        />
                    </div>

                    {/* Toggle Controls */}
                    <div className="flex gap-x-2 md:gap-x-3">
                        <ToggleAudioPreviewButton />
                        <ToggleVideoPreviewButton />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 md:gap-3 w-full">
                        <Button
                            asChild
                            variant="outline"
                            className="w-full sm:flex-1 h-10 md:h-11 border-primary/30 bg-white/5 hover:bg-white/10 hover:border-primary/50 text-white text-sm md:text-base transition-all duration-200"
                        >
                            <Link href="/dashboard/meetings">
                                Cancel
                            </Link>
                        </Button>
                        <Button
                            onClick={onJoin}
                            disabled={!hasBrowserMediaPermission}
                            className="w-full sm:flex-1 h-10 md:h-11 bg-primary hover:bg-primary/90 text-background font-medium shadow-lg shadow-primary/20 text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            <LogInIcon className="mr-2 size-4" />
                            Join Call
                        </Button>
                    </div>

                    {/* Permission Helper Text */}
                    {!hasBrowserMediaPermission && (
                        <p className="text-xs text-gray-500 text-center">
                            Enable camera and microphone permissions to join
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}