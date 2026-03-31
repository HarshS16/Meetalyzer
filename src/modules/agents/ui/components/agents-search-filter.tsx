import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

import { useAgentFilters } from "../../hooks/use-agents-filter";

export const AgentsSearchFilters = () => {
  const [filters, setFilters] = useAgentFilters();

  return (
    <div className="relative">
      <Input
        placeholder="Filter by name..."
        className="h-9 bg-white/5 border-primary/30 w-[200px] md:w-[250px] pl-9 text-white placeholder:text-gray-500 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
        value={filters.search}
        onChange={(e) => setFilters({ search: e.target.value })}
      />
      <SearchIcon className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  );
};