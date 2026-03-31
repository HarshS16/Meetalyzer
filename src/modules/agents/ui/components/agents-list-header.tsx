"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon, XIcon } from "lucide-react";
import { NewAgentDialog } from "./new-agent-dialog";
import { useState } from "react";
import { useAgentFilters } from "../../hooks/use-agents-filter";
import { AgentsSearchFilters } from "./agents-search-filter";
import { DEFAULT_PAGE } from "@/constants";

export const AgentsListHeader = () => {
  const [filters, setFilters] = useAgentFilters();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isAnyFilterModified = !!filters.search;

  const onClearFilters = () => {
    setFilters({
      search: "",
      page: DEFAULT_PAGE,
    });
  };

  return (
    <>
      <NewAgentDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      <div className="py-4 px-4 md:px-6 lg:px-8 flex flex-col gap-y-4">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              My Agents
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Create and manage your AI agents
            </p>
          </div>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-primary hover:bg-primary/90 text-background font-medium transition-all duration-200 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 shrink-0 w-full sm:w-auto"
          >
            <PlusIcon className="size-4 mr-2" />
            <span className="hidden sm:inline">New Agent</span>
            <span className="sm:hidden">Create New Agent</span>
          </Button>
        </div>

        {/* Filters Section */}
        <div className="flex items-center gap-2">
          <AgentsSearchFilters />
          {isAnyFilterModified && (
            <Button 
              variant="outline" 
              onClick={onClearFilters}
              size="sm"
              className="border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 hover:border-red-500/50 transition-all duration-200"
            >
              <XIcon className="size-4 mr-1.5" />
              <span className="hidden sm:inline">Clear</span>
            </Button>
          )}
        </div>
      </div>
    </>
  );
};