import { CommandSelect } from "@/components/command-select";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useMeetingsFilters } from "../../hooks/use-meetings-filter";

export const AgentIdFilter = () => {
  const trpc = useTRPC();
  const [filters, setFilters] = useMeetingsFilters();
  const [agentSearch, setAgentSearch] = useState("");

  const agents = useQuery(
    trpc.agents.getMany.queryOptions({
      pageSize: 100,
      search: agentSearch,
    })
  );

  const options = (agents.data?.items ?? []).map((agent) => ({
    id: agent.id,
    value: agent.id,
    children: (
      <div className="flex items-center gap-x-2">
        <GeneratedAvatar
          seed={agent.name}
          variant="botttsNeutral"
          className="size-6 border border-primary/30 ring-1 ring-primary/10 rounded-full"
        />
        <span className="capitalize">{agent.name}</span>
      </div>
    ),
  }));

  return (
    <CommandSelect
      placeholder="Agent"
      className="h-9 w-[140px] md:w-[180px]"
      options={options}
      onSelect={(value) => setFilters({ agentId: value })}
      onSearch={setAgentSearch}
      value={filters.agentId ?? ""}
    />
  );
};