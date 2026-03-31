"use client";

import { ErrorState } from "@/components/alert-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { AgentIdViewHeader } from "../components/agent-id-view-header";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Badge } from "@/components/ui/badge";
import { VideoIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";
import { useState } from "react";
import { UpdateAgentDialog } from "../components/update-agent-dialog";

interface Props {
  agentId: string;
}

export const AgentIdView = ({ agentId }: Props) => {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [updateAgentDialogOpen, setUpdateAgentDialogOpen] = useState(false);

  const { data } = useSuspenseQuery(
    trpc.agents.getOne.queryOptions({ id: agentId }),
  );

  const removeAgent = useMutation(
    trpc.agents.remove.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.agents.getMany.queryOptions({}),
        );
        //TODO: Invlalidate free tier usage
        router.push("/dashboard/agents");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const [RemoveConfirmation, confirmRemove] = useConfirm(
    "Are you sure?",
    `The following action will remove ${data.meetingCount} meetings associated with this agent. This action cannot be undone.`,
  );

  const handleRemoveAgent = async () => {
    const confirmed = await confirmRemove();

    if (!confirmed) return;

    await removeAgent.mutate({ id: agentId });
  };

  return (
    <>
      <RemoveConfirmation />
      <UpdateAgentDialog
        open={updateAgentDialogOpen}
        onOpenChange={setUpdateAgentDialogOpen}
        initalValues={data}
      />
      <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-6">
        <AgentIdViewHeader
          agentId={agentId}
          agentName={data.name}
          onEdit={() => setUpdateAgentDialogOpen(true)}
          onRemove={handleRemoveAgent}
        />

        <div className="glass border border-primary/20 rounded-2xl overflow-hidden">
          <div className="px-6 py-6 flex flex-col gap-y-6">
            {/* Agent Header */}
            <div className="flex items-center gap-x-4">
              <GeneratedAvatar
                variant="botttsNeutral"
                seed={data.name}
                className="size-16 md:size-20 border-2 border-primary/30 ring-4 ring-primary/10 rounded-full"
              />
              <div className="flex flex-col gap-y-3">
                <h2 className="text-2xl md:text-3xl font-bold text-white capitalize">
                  {data.name}
                </h2>
                <Badge
                  variant="outline"
                  className="flex items-center gap-x-2 w-fit px-3 py-1.5 border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  <VideoIcon className="size-3.5" />
                  <span className="font-medium">
                    {data.meetingCount}{" "}
                    {data.meetingCount === 1 ? "Meeting" : "Meetings"}
                  </span>
                </Badge>
              </div>
            </div>

            <Separator className="bg-primary/20" />

            {/* Instructions Section */}
            <div className="flex flex-col gap-y-3">
              <h3 className="text-lg font-semibold text-white">Instructions</h3>
              <div className="glass border border-primary/20 rounded-xl p-4">
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {data.instructions}
                </p>
              </div>
            </div>

            {/* Additional Info Section (Optional) */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass border border-primary/20 rounded-xl p-4">
              <h4 className="text-sm font-medium text-gray-400 mb-1">
                Created
              </h4>
              <p className="text-white font-medium">
                {new Date(data.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="glass border border-primary/20 rounded-xl p-4">
              <h4 className="text-sm font-medium text-gray-400 mb-1">
                Last Updated
              </h4>
              <p className="text-white font-medium">
                {new Date(data.updatedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export const AgentIdViewLoading = () => {
  return (
    <LoadingState
      title="Loading Agent"
      description="Please wait while we fetch the agent details..."
    />
  );
};

export const AgentIdViewError = () => {
  return (
    <ErrorState
      title="Error Loading Agent"
      description="Failed to load agent details. Please try again later."
    />
  );
};
