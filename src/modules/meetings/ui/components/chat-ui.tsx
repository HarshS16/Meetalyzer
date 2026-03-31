"use client"

import { useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Channel as StreamChannel } from "stream-chat";
import {
    useCreateChatClient,
    Chat,
    Channel,
    MessageInput,
    MessageList,
    Thread,
    Window
} from "stream-chat-react";

import { useTRPC } from "@/trpc/client";
import { LoadingState } from "@/components/loading-state";

import "stream-chat-react/dist/css/v2/index.css"
import { UserBannedEvent } from "@stream-io/node-sdk";

interface ChatUIProps {
    meetingId: string;
    meetingName: string;
    userId: string;
    userName: string;
    userImage: string | undefined;
}

export const ChatUI = ({ meetingId, meetingName, userId, userName, userImage }: ChatUIProps) => {
    const trpc = useTRPC();
    const { mutateAsync: generateChatToken } = useMutation(
        trpc.meetings.generateChatToken.mutationOptions()
    )

    const [channel, setChannel] = useState<StreamChannel>();
    const client = useCreateChatClient({
        apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY!,
        tokenOrProvider: generateChatToken,
        userData: {
            id: userId,
            name: userName,
            image: userImage,
        },
    })


    useEffect(() => {
        if (!client) return;

        const channel = client.channel("messaging", meetingId, {
            members: [userId],
        })

        setChannel(channel);

    }, [client, meetingId, meetingName, userId])


    if (!client || !channel) {
        return <LoadingState title="Loading Chat" description="Setting up the chat connection..." />;
    }

    return (
        <div className="glass border border-primary/20 rounded-lg overflow-hidden h-[calc(100vh-12rem)] w-full [&_.str-chat]:w-full [&_.str-chat]:h-full [&_.str-chat]:bg-transparent">
            <Chat client={client} theme="str-chat__theme-dark">
                <Channel channel={channel}>
                    <Window>
                        <MessageList />
                        <MessageInput />
                    </Window>
                    <Thread />
                </Channel>
            </Chat>
        </div>
    )
}