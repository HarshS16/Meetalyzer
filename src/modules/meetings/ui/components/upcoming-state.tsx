import Link from "next/link";
import { VideoIcon, BanIcon } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";

interface Props {
  meetingId: string;
  onCancelMeeting: () => void;
  isCancelling: boolean;
}

export const UpcomingState = ({
  meetingId,
  onCancelMeeting,
  isCancelling,
}: Props) => {
  return (
    <div className="glass border border-yellow-500/30 rounded-2xl px-6 py-8 flex flex-col gap-y-8 items-center">
      <div className="flex items-center gap-x-2 mb-2">
        <div className="size-3 rounded-full bg-yellow-500" />
        <span className="text-yellow-400 font-semibold text-sm uppercase tracking-wide">
          Scheduled
        </span>
      </div>
      <EmptyState
        image="/upcoming.svg"
        title="Not Started Yet"
        description="This meeting is scheduled but hasn't started. Click the button below to begin."
      />
      <div className="flex flex-col-reverse lg:flex-row lg:justify-center items-center gap-3 w-full max-w-md">
        <Button
          variant="outline"
          className="w-full lg:w-auto border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 hover:border-red-500/50 transition-all duration-200"
          onClick={onCancelMeeting}
          disabled={isCancelling}
        >
          <BanIcon className="size-4 mr-2" />
          Cancel Meeting
        </Button>
        <Button
          disabled={isCancelling}
          asChild
          className="w-full lg:w-auto bg-primary hover:bg-primary/90 text-background font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200"
        >
          <Link href={`/call/${meetingId}`}>
            <VideoIcon className="size-4 mr-2" />
            Start Meeting
          </Link>
        </Button>
      </div>
    </div>
  );
};
