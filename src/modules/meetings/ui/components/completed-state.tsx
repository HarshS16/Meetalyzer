import Markdown from "react-markdown";
import Link from "next/link";
import {
  BookOpenTextIcon,
  ClockIcon,
  FileTextIcon,
  FileVideoIcon,
  SparklesIcon,
  MessageSquareIcon
} from "lucide-react";

import { GeneratedAvatar } from "@/components/generated-avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MeetingGetOne } from "../../types";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { formatDuration } from "@/lib/utils";
import { Transcript } from "./transcript";
import { ChatProvider } from "./chat-provider";

interface Props {
  data: MeetingGetOne;
}

export const CompletedState = ({ data }: Props) => {
  return (
    <div className="flex flex-col gap-y-4">
      <Tabs defaultValue="summary" className="w-full">
        {/* Tabs Navigation */}
        <div className="glass border border-primary/20 rounded-xl overflow-hidden">
          <ScrollArea className="w-full">
            <TabsList className="w-full justify-start bg-transparent p-0 h-auto border-b border-primary/10">
              <TabsTrigger
                value="summary"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary text-gray-400 data-[state=active]:text-white hover:text-white transition-colors px-4 md:px-6 py-3 rounded-none gap-2"
              >
                <BookOpenTextIcon className="size-4" />
                <span className="hidden sm:inline">Summary</span>
              </TabsTrigger>
              <TabsTrigger
                value="transcript"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary text-gray-400 data-[state=active]:text-white hover:text-white transition-colors px-4 md:px-6 py-3 rounded-none gap-2"
              >
                <FileTextIcon className="size-4" />
                <span className="hidden sm:inline">Transcript</span>
              </TabsTrigger>
              <TabsTrigger
                value="recording"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary text-gray-400 data-[state=active]:text-white hover:text-white transition-colors px-4 md:px-6 py-3 rounded-none gap-2"
              >
                <FileVideoIcon className="size-4" />
                <span className="hidden sm:inline">Recording</span>
              </TabsTrigger>
              <TabsTrigger
                value="chat"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary text-gray-400 data-[state=active]:text-white hover:text-white transition-colors px-4 md:px-6 py-3 rounded-none gap-2"
              >
                <MessageSquareIcon className="size-4" />
                <span className="hidden sm:inline">Ask AI</span>
              </TabsTrigger>
            </TabsList>
          </ScrollArea>
        </div>

        {/* Recording Tab */}
        <TabsContent value="recording" className="mt-4">
          <div className="glass border border-primary/20 rounded-xl p-4 md:p-6">
            <video
              src={data.recordingUrl!}
              controls
              className="w-full rounded-lg border border-primary/20 bg-black"
            />
          </div>
        </TabsContent>

        {/* Summary Tab */}
        <TabsContent value="summary" className="mt-4">
          <div className="flex flex-col gap-4">
            {/* Meeting Header */}
            <div className="glass border border-primary/20 rounded-xl p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
                {data.name}
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                <Link
                  href={`/dashboard/agents/${data.agent.id}`}
                  className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors w-fit"
                >
                  <GeneratedAvatar
                    variant="botttsNeutral"
                    seed={data.agent.name}
                    className="size-6 border border-primary/30 ring-1 ring-primary/10 rounded-full"
                  />
                  <span className="capitalize font-medium">{data.agent.name}</span>
                </Link>
                <span className="hidden sm:inline text-gray-600">•</span>
                <p className="text-sm text-gray-400">
                  {data.createdAt ? format(data.createdAt, "PPP") : ""}
                </p>
              </div>
              <Badge
                variant="outline"
                className="flex items-center gap-2 w-fit px-3 py-1.5 border-primary/30 bg-primary/10 text-primary"
              >
                <ClockIcon className="size-3.5" />
                <span className="font-medium">
                  {data.duration ? formatDuration(data.duration) : "N/A"}
                </span>
              </Badge>
            </div>

            {/* Summary Content */}
            <div className="glass border border-primary/20 rounded-xl p-4 md:p-6">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-primary/10">
                <SparklesIcon className="size-5 text-primary" />
                <h3 className="text-lg font-semibold text-white">AI Summary</h3>
              </div>
              <div className="prose prose-invert prose-sm md:prose-base max-w-none">
                <Markdown
                  components={{
                    h1: (props) => (
                      <h1 className="text-xl md:text-2xl font-bold text-white mb-4 mt-6" {...props} />
                    ),
                    h2: (props) => (
                      <h2 className="text-lg md:text-xl font-bold text-white mb-3 mt-5" {...props} />
                    ),
                    h3: (props) => (
                      <h3 className="text-base md:text-lg font-semibold text-white mb-2 mt-4" {...props} />
                    ),
                    h4: (props) => (
                      <h4 className="text-sm md:text-base font-semibold text-white mb-2 mt-3" {...props} />
                    ),
                    p: (props) => (
                      <p className="text-sm md:text-base text-gray-300 mb-3 leading-relaxed" {...props} />
                    ),
                    ul: (props) => (
                      <ul className="list-disc list-inside mb-3 text-gray-300 space-y-1" {...props} />
                    ),
                    ol: (props) => (
                      <ol className="list-decimal list-inside mb-3 text-gray-300 space-y-1" {...props} />
                    ),
                    li: (props) => (
                      <li className="text-sm md:text-base text-gray-300 mb-1" {...props} />
                    ),
                    a: (props) => (
                      <a className="text-primary hover:text-primary/80 underline transition-colors" {...props} />
                    ),
                    code: (props) => (
                      <code className="bg-white/10 border border-primary/20 px-1.5 py-0.5 rounded text-primary text-sm" {...props} />
                    ),
                    blockquote: (props) => (
                      <blockquote className="border-l-4 border-primary/50 pl-4 my-3 italic text-gray-400" {...props} />
                    ),
                    hr: (props) => (
                      <hr className="my-6 border-primary/20" {...props} />
                    ),
                    strong: (props) => (
                      <strong className="font-semibold text-white" {...props} />
                    ),
                  }}
                >
                  {data.summary}
                </Markdown>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Transcript Tab */}
        <TabsContent value="transcript" className="mt-4">
          <Transcript meetingId={data.id} />
        </TabsContent>

        {/* Ask AI Tab */}
        <TabsContent value="chat" className="mt-4">
          <ChatProvider meetingId={data.id} meetingName={data.name} />
        </TabsContent>
      </Tabs>
    </div>
  );
};