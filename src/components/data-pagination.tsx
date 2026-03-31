import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface Props {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const DataPagination = ({ page, totalPages, onPageChange }: Props) => {
  return (
    <div className="flex items-center justify-between py-3 px-4">
      <div className="flex-1 text-sm text-gray-400">
        <span className="font-medium text-white">{page}</span> of{" "}
        <span className="font-medium text-white">{totalPages || 1}</span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          disabled={page === 1}
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          className="border-primary/30 bg-white/5 hover:bg-white/10 hover:border-primary/50 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
        >
          <ChevronLeftIcon className="size-4 mr-1" />
          <span className="hidden sm:inline">Previous</span>
        </Button>
        <Button
          disabled={page === totalPages || totalPages === 0}
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          className="border-primary/30 bg-white/5 hover:bg-white/10 hover:border-primary/50 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRightIcon className="size-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};
