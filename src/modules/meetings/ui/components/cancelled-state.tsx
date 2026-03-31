import { EmptyState } from "@/components/empty-state";

export const CancelledState = () => {
  return (
    <div className="glass border border-red-500/30 rounded-2xl px-6 py-8 flex flex-col gap-y-8 items-center">
      <div className="flex items-center gap-x-2 mb-2">
        <div className="size-3 rounded-full bg-red-500" />
        <span className="text-red-400 font-semibold text-sm uppercase tracking-wide">
          Cancelled
        </span>
      </div>
      <EmptyState
        image="/cancelled.svg"
        title="Meeting Cancelled"
        description="This meeting has been cancelled and is no longer available."
      />
    </div>
  );
};
