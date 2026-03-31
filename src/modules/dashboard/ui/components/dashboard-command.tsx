import {
  CommandDialog,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandSeparator,
} from "@/components/ui/command";
import { Dispatch, SetStateAction } from "react";
import { VideoIcon, BotIcon, SearchIcon } from "lucide-react";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const DashboardCommand = ({ open, setOpen }: Props) => {
  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      className="glass-strong border border-primary/30 bg-[#0a0f1a]/95"
    >
      <CommandInput
        placeholder="Search meetings, agents, or commands..."
        className="border-b border-primary/20 text-white placeholder:text-gray-500 focus:ring-0"
      />
      <CommandList className="max-h-[400px]">
        <CommandEmpty className="py-6 text-center text-sm text-gray-400">
          No results found.
        </CommandEmpty>

        <CommandGroup
          heading="Quick Actions"
          className="text-gray-400 px-2 py-3"
        >
          <CommandItem className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-lg text-white hover:bg-white/10 hover:text-primary aria-selected:bg-white/10 aria-selected:text-primary transition-colors">
            <VideoIcon className="size-4" />
            <span>New Meeting</span>
          </CommandItem>
          <CommandItem className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-lg text-white hover:bg-white/10 hover:text-primary aria-selected:bg-white/10 aria-selected:text-primary transition-colors">
            <BotIcon className="size-4" />
            <span>Create Agent</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator className="bg-primary/20 my-1" />

        <CommandGroup heading="Recent" className="text-gray-400 px-2 py-3">
          <CommandItem className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-lg text-white hover:bg-white/10 hover:text-primary aria-selected:bg-white/10 aria-selected:text-primary transition-colors">
            <SearchIcon className="size-4" />
            <div className="flex flex-col">
              <span className="text-sm">Team Standup - Dec 9</span>
              <span className="text-xs text-gray-500">Meeting</span>
            </div>
          </CommandItem>
          <CommandItem className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-lg text-white hover:bg-white/10 hover:text-primary aria-selected:bg-white/10 aria-selected:text-primary transition-colors">
            <SearchIcon className="size-4" />
            <div className="flex flex-col">
              <span className="text-sm">Customer Support Agent</span>
              <span className="text-xs text-gray-500">Agent</span>
            </div>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
