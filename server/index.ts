import { publicProcedure, router } from './trpc';

const dummyUsers: { username: string; birthday: Date }[] = [
  {
    username: 'ThaBeanBoy',
    birthday: new Date(),
  },
];

const appRouter = router({
  userList: publicProcedure.query(() => dummyUsers),
});

export type AppRouter = typeof appRouter;
