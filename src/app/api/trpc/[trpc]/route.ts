import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { createTRPCContext, createTRPCRouter, baseProcedure } from '@/trpc/init';
import { appRouter } from '@/trpc/routers/_app';

const handler = (req: Request) =>
    fetchRequestHandler({
        endpoint: '/api/trpc',
        req,
        router: appRouter,
        createContext: createTRPCContext,
    });

export { handler as GET, handler as POST };