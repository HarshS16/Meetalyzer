"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon, XIcon } from "lucide-react";
import { NewMeetingDialog } from "./new-meeting-dialog";
import { useState } from "react";
import { MeetingsSearchFilters } from "./meetings-search-filter";
import { StatusFilter } from "./status-filter";
import { AgentIdFilter } from "./agent-id-filter";
import { useMeetingsFilters } from "../../hooks/use-meetings-filter";
import { DEFAULT_PAGE } from "@/constants";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export const MeetingsListHeader = () => {
  const [filters, setFilters] = useMeetingsFilters();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isAnyFilterModified =
    !!filters.status || !!filters.search || !!filters.agentId;

  const onClearFilters = () => {
    setFilters({
      status: null,
      agentId: "",
      search: "",
      page: DEFAULT_PAGE,
    });
  };

  return (
    <>
      <NewMeetingDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      <div className="py-4 px-4 md:px-6 lg:px-8 flex flex-col gap-y-4">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              My Meetings
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Create and manage your AI-powered meetings
            </p>
          </div>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-primary hover:bg-primary/90 text-background font-medium transition-all duration-200 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 shrink-0 w-full sm:w-auto"
          >
            <PlusIcon className="size-4 mr-2" />
            <span className="hidden sm:inline">New Meeting</span>
            <span className="sm:hidden">Create New Meeting</span>
          </Button>
        </div>

        {/* Filters Section */}
        <ScrollArea>
          <div className="flex flex-wrap items-center gap-2">
            <MeetingsSearchFilters />
            <StatusFilter />
            <AgentIdFilter />
            {isAnyFilterModified && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClearFilters}
                className="h-9 px-3 border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 hover:border-red-500/50 transition-all duration-200"
              >
                <XIcon className="size-4 mr-1.5" />
                <span className="hidden sm:inline">Clear</span>
              </Button>
            )}
          </div>
          <ScrollBar />
        </ScrollArea>
      </div>
    </>
  );
};
