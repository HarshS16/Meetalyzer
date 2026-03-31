import { format } from "date-fns";
import { useState } from "react";
import { FileTextIcon, SearchIcon } from "lucide-react";
import Highlighter from "react-highlight-words";
import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { generateAvatarUri } from "@/lib/avatar";

interface Props {
    meetingId: string;
}

export const Transcript = ({ meetingId }: Props) => {
    const trpc = useTRPC();
    const { data } = useQuery(trpc.meetings.getTranscript.queryOptions({ id: meetingId }));

    const [searchQuery, setSearchQuery] = useState("");
    const filteredData = (data ?? [])
        .filter((item) =>
            item.text
                .toString()
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
        );

    return (
        <div className="glass border border-primary/20 rounded-xl p-4 md:p-6">
    
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-primary/10">
                <div className="flex items-center gap-2">
                    <FileTextIcon className="size-5 text-primary" />
                    <h3 className="text-lg font-semibold text-white">Transcript</h3>
                    {data && data.length > 0 && (
                        <span className="text-xs text-gray-500">
                            ({data.length} {data.length === 1 ? 'entry' : 'entries'})
                        </span>
                    )}
                </div>
                
                <div className="relative w-full sm:w-auto">
                    <Input
                        placeholder="Search transcript..."
                        className="h-9 bg-white/5 border-primary/30 w-full sm:w-[240px] md:w-[280px] pl-9 text-white placeholder:text-gray-500 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
                </div>
            </div>

            {/* Transcript Content */}
            <ScrollArea className="h-[600px] pr-4">
                {filteredData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <FileTextIcon className="size-12 text-gray-600 mb-3" />
                        <p className="text-sm text-gray-400">
                            {searchQuery ? 'No matching transcript entries found' : 'No transcript available'}
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {filteredData.map((item, index) => (
                            <div 
                                key={item.start_ts + index} 
                                className="flex flex-col gap-2 p-3 md:p-4 rounded-lg border border-primary/10 bg-white/5 hover:bg-white/10 hover:border-primary/20 transition-all duration-200"
                            >
                                
                                <div className="flex items-center gap-2">
                                    <Avatar className="size-6 md:size-7 border border-primary/30 ring-1 ring-primary/10">
                                        <AvatarImage 
                                            src={
                                                item.user.image ?? 
                                                generateAvatarUri({ 
                                                    seed: item.user.name, 
                                                    variant: "initials" 
                                                })
                                            } 
                                            alt={`${item.user.name} avatar`} 
                                        />
                                    </Avatar>
                                    <p className="text-sm font-semibold text-white">
                                        {item.user.name}
                                    </p>
                                    <span className="text-gray-600 hidden sm:inline">•</span>
                                    <p className="text-xs md:text-sm text-primary font-medium">
                                        {format(
                                            new Date(0, 0, 0, 0, 0, 0, item.start_ts),
                                            "mm:ss"
                                        )}
                                    </p>
                                </div>
                                
                              
                                <Highlighter
                                    className="text-sm md:text-base text-gray-300 leading-relaxed pl-0 sm:pl-9"
                                    highlightClassName="bg-primary/30 text-white font-medium rounded px-1"
                                    searchWords={[searchQuery]}
                                    autoEscape={true}
                                    textToHighlight={item.text}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </ScrollArea>
        </div>
    );
};