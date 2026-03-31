import { ReactNode, useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

import {
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandResponsiveDialog,
} from "./ui/command";

interface Props {
  options: Array<{
    id: string;
    value: string;
    children: ReactNode;
  }>;
  onSelect: (value: string) => void;
  onSearch?: (value: string) => void;
  value?: string;
  placeholder?: string;
  isSearchable?: boolean;
  className?: string;
}

export const CommandSelect = ({
  options,
  onSelect,
  onSearch,
  value,
  placeholder = "Select an option",
  className,
}: Props) => {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value);

  const handleOpenChange = (open: boolean) => {
    onSearch?.("");
    setOpen(open);
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        type="button"
        variant="outline"
        className={cn(
          "w-full h-9 justify-between font-normal px-3",
          "border-primary/30 bg-white/5 hover:bg-white/10 hover:border-primary/50",
          "text-white transition-all duration-200",
          !selectedOption && "text-gray-500",
          className,
        )}
      >
        <div className="flex items-center gap-x-2 min-w-0 flex-1 truncate">
          {selectedOption?.children ?? (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </div>
        <ChevronDownIcon className="ml-2 size-4 shrink-0 text-gray-400" />
      </Button>

      <CommandResponsiveDialog
        shouldFilter={!onSearch}
        open={open}
        onOpenChange={handleOpenChange}
        title="Select an Option"
        description="Search and select from the list below"
      >
        <CommandInput placeholder="Search..." onValueChange={onSearch} />
        <CommandList className="p-1 pb-2">
          <CommandEmpty>
            <div className="flex flex-col items-center gap-2 py-4">
              <span className="text-sm text-gray-400">No options found</span>
              <span className="text-xs text-gray-600">
                Try a different search term
              </span>
            </div>
          </CommandEmpty>
          {options.map((option) => (
            <CommandItem
              key={option.id}
              onSelect={() => {
                onSelect(option.value);
                setOpen(false);
              }}
              className={cn(
                value === option.value &&
                  "bg-primary/20 text-primary border border-primary/30",
              )}
            >
              {option.children}
              {value === option.value && (
                <span className="ml-auto text-primary text-xs font-medium">
                  Selected
                </span>
              )}
            </CommandItem>
          ))}
        </CommandList>
      </CommandResponsiveDialog>
    </>
  );
};
