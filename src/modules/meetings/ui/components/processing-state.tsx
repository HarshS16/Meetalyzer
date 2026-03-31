import { EmptyState } from "@/components/empty-state";
import { Loader2Icon } from "lucide-react";

export const ProcessingState = () => {
  return (
    <div className="glass border border-purple-500/30 rounded-2xl px-6 py-8 flex flex-col gap-y-8 items-center">
      <div className="flex items-center gap-x-2 mb-2">
        <Loader2Icon className="size-3 text-purple-500 animate-spin" />
        <span className="text-purple-400 font-semibold text-sm uppercase tracking-wide">
          Processing
        </span>
      </div>
      <EmptyState
        image="/processing.svg"
        title="Meeting is Processing"
        description="We're processing your meeting data. This usually takes a few moments. Please check back shortly."
      />
    </div>
  );
};
