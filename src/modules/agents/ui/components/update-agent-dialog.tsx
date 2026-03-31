"use client";

import { ResponsiveDialog } from "@/components/responsive-dialog";
import { AgentForm } from "./agent-form";
import { AgentGetOne } from "../../types";

interface UpdateAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initalValues?: AgentGetOne;
}

export const UpdateAgentDialog = ({
  open,
  onOpenChange,
  initalValues,
}: UpdateAgentDialogProps) => {
  return (
    <ResponsiveDialog
      title="Update Agent"
      description="Update your AI agent with a name and instructions to define its behavior and personality."
      open={open}
      onOpenChange={onOpenChange}
    >
      <AgentForm
        onSuccess={() => onOpenChange(false)}
        onCancel={() => onOpenChange(false)}
        initialValues={initalValues}
      />
    </ResponsiveDialog>
  );
};
