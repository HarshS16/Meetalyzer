import Link from "next/link";
import Image from "next/image";
import {
    CallControls,
    SpeakerLayout
} from "@stream-io/video-react-sdk";

interface Props {
    onLeave: () => void | Promise<void>;
    meetingName: string;
}

export const CallActive = ({ onLeave, meetingName }: Props) => {
    return (
        <div className="flex flex-col justify-between p-3 md:p-4 lg:p-6 h-full text-white gap-3 md:gap-4">
            {/* Header */}
            <div className="glass-strong border border-primary/30 rounded-xl md:rounded-2xl p-2 md:p-3 lg:p-4 flex items-center gap-2 md:gap-3 shadow-lg">
                <Link 
                    href="/dashboard/meetings" 
                    className="flex items-center justify-center p-1.5 md:p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-200 shrink-0"
                >
                    <Image 
                        src="/logo.svg" 
                        alt="Logo" 
                        width={18}
                        height={18}
                        className="md:w-6 md:h-6"
                    />
                </Link>
                <div className="flex-1 min-w-0">
                    <h4 className="text-xs md:text-sm lg:text-base font-semibold text-white truncate">
                        {meetingName}
                    </h4>
                    <div className="flex items-center gap-1.5 md:gap-2 mt-0.5 md:mt-1">
                        <div className="size-1.5 md:size-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] md:text-xs text-green-400 font-medium">
                            Live
                        </span>
                    </div>
                </div>
            </div>

            {/* Video Grid */}
            <div className="flex-1 rounded-xl md:rounded-2xl overflow-hidden border border-primary/20 min-h-0 bg-black/50">
                <SpeakerLayout />
            </div>

            {/* Controls */}
            <div className="glass-strong border border-primary/30 rounded-xl md:rounded-2xl p-2 md:p-3 shadow-lg overflow-x-auto">
                <div className="min-w-max mx-auto w-fit">
                    <CallControls onLeave={onLeave} />
                </div>
            </div>
        </div>
    )
}