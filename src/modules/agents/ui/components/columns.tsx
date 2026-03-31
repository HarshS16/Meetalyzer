"use client";

import { ColumnDef } from "@tanstack/react-table";
import { AgentGetMany } from "../../types";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { CornerDownRightIcon, VideoIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<AgentGetMany[number]>[] = [
  {
    accessorKey: "name",
    header: "Agent Name",
    cell: ({ row }) => (
      <div className="flex flex-col gap-y-2 py-1">
        <div className="flex items-center gap-x-3">
          <GeneratedAvatar
            variant="botttsNeutral"
            seed={row.original.name}
            className="size-10 border-2 border-primary/30 ring-2 ring-primary/10 rounded-full"
          />
          <span className="font-semibold text-white text-base capitalize">
            {row.original.name}
          </span>
        </div>
        <div className="flex items-center gap-x-2 ml-1">
          <CornerDownRightIcon className="size-3 text-gray-500 shrink-0" />
          <span className="text-sm text-gray-400 max-w-[300px] md:max-w-[400px] truncate">
            {row.original.instructions}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "meetingCount",
    header: "Meetings",
    cell: ({ row }) => (
      <div className="flex justify-end pr-4">
        <Badge
          variant="outline"
          className="flex items-center gap-x-2 px-3 py-1.5 border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
        >
          <VideoIcon className="size-3.5" />
          <span className="font-medium">
            {row.original.meetingCount || 0}{" "}
            {row.original.meetingCount === 1 ? "Meeting" : "Meetings"}
          </span>
        </Badge>
      </div>
    ),
  },
];
