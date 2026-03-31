"use client";
import { format } from "date-fns";

import {
  CornerDownRightIcon,
  CircleCheckIcon,
  CircleXIcon,
  ClockArrowUpIcon,
  ClockFadingIcon,
  LoaderIcon,
} from "lucide-react";

import { cn, formatDuration } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { MeetingGetMany } from "../../types";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Badge } from "@/components/ui/badge";

const statusIconMap = {
  upcoming: ClockArrowUpIcon,
  active: LoaderIcon,
  completed: CircleCheckIcon,
  processing: LoaderIcon,
  cancelled: CircleXIcon,
};

const statusColorMap = {
  upcoming:  "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  active:    "bg-green-500/10  text-green-400  border-green-500/30",
  completed: "bg-blue-500/10   text-blue-400   border-blue-500/30",
  cancelled: "bg-red-500/10    text-red-400    border-red-500/30",
  processing:"bg-purple-500/10 text-purple-400 border-purple-500/30",
};

export const columns: ColumnDef<MeetingGetMany[number]>[] = [
  {
    accessorKey: "name",
    header: "Meeting Name",
    cell: ({ row }) => (
      <div className="flex flex-col gap-y-2 py-1">
        <span className="font-semibold text-white text-base capitalize">
          {row.original.name}
        </span>
        <div className="flex items-center gap-x-2 ml-1">
          <CornerDownRightIcon className="size-3 text-gray-500 shrink-0" />
          <GeneratedAvatar
            variant="botttsNeutral"
            seed={row.original.agent.name}
            className="size-6 border border-primary/30 ring-1 ring-primary/10 rounded-full"
          />
          <span className="text-sm text-gray-400 max-w-[200px] md:max-w-[300px] truncate">
            {row.original.agent.name}
          </span>
          {row.original.startedAt && (
            <>
              <span className="text-gray-600">·</span>
              <span className="text-xs text-gray-500">
                {format(row.original.startedAt, "MMM d")}
              </span>
            </>
          )}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const Icon = statusIconMap[row.original.status as keyof typeof statusIconMap];
      const colorClass = statusColorMap[row.original.status as keyof typeof statusColorMap];

      return (
        <Badge
          variant="outline"
          className={cn(
            "flex items-center gap-x-1.5 px-2.5 py-1 w-fit capitalize font-medium text-xs",
            colorClass
          )}
        >
          <Icon
            className={cn(
              "size-3.5",
              row.original.status === "processing" && "animate-spin",
              row.original.status === "active" && "animate-spin",
            )}
          />
          {row.original.status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="flex items-center gap-x-1.5 px-2.5 py-1 w-fit border-primary/30 bg-primary/10 text-primary font-medium text-xs"
      >
        <ClockFadingIcon className="size-3.5" />
        {row.original.duration ? formatDuration(row.original.duration) : "N/A"}
      </Badge>
    ),
  },
];