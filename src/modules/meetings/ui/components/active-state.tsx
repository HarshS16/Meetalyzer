import Link from "next/link";
import { VideoIcon } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";

interface Props {
  meetingId: string;
}

export const ActiveState = ({ meetingId }: Props) => {
  return (
    <div className="glass border border-green-500/30 rounded-2xl px-6 py-8 flex flex-col gap-y-8 items-center">
      <div className="flex items-center gap-x-2 mb-2">
        <div className="size-3 rounded-full bg-green-500 animate-pulse" />
        <span className="text-green-400 font-semibold text-sm uppercase tracking-wide">
          Live Now
        </span>
      </div>
      <EmptyState
        image="/active.svg"
        title="Meeting is Active"
        description="The meeting is currently in progress. Join now to participate with other attendees."
      />
      <div className="flex flex-col-reverse lg:flex-row lg:justify-center items-center gap-3 w-full max-w-md">
        <Button
          asChild
          className="w-full lg:w-auto bg-green-500 hover:bg-green-600 text-white font-medium shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/30 transition-all duration-200"
        >
          <Link href={`/call/${meetingId}`}>
            <VideoIcon className="size-4 mr-2" />
            Join Meeting
          </Link>
        </Button>
      </div>
    </div>
  );
};
