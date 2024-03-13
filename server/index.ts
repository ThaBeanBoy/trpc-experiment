import { z } from 'zod';
import { publicProcedure, router } from './trpc';

const userSchema = z.object({
  name: z.string().optional(),
  username: z.string(),
  birthday: z.date(),
});

type userType = z.infer<typeof userSchema>;

const dummyUsers: userType[] = [
  { username: 'ThaBeanBoy', birthday: new Date(), name: 'Tineyi' },
  { username: 'Bhazooka', birthday: new Date() /* name: 'Baraka' */ },
  { username: 'Tmak', birthday: new Date(), name: 'Tanaka' },
  { username: 'Kays', birthday: new Date() /* name: 'Anozivaishe' */ },
];

const similar = (...inputs: string[]) => {
  // transforming the texts
  inputs.map((input) => input.trim().toLowerCase().replace(' ', ''));

  return inputs.every((input) => input === inputs[0]);
};

const getUserSchema = z.object({
  username: z.string().optional(),
  name: z.string(),
  birthday: z
    .object({
      from: z.date().optional(),
      to: z.date().optional(),
    })
    .optional(),
});

const appRouter = router({
  users: {
    get: publicProcedure
      .input(getUserSchema)

      .query((opts) => {
        const { input } = opts;

        return dummyUsers.filter((user) => {
          // checking name
          if (user.name && input.name && !similar(user.name)) return false;

          // checking username
          if (input.username && !similar(user.username)) return false;

          // checking birthday range
          if (input.birthday) {
            const { from, to } = input.birthday;

            // user birthday smaller than `from` date
            if (from && user.birthday.getTime() < from.getTime()) return false;

            // user birthday greater than `to` date
            if (to && user.birthday.getTime() > to.getTime()) return false;
          }

          return true;
        });
      }),
  },
});

export type AppRouter = typeof appRouter;
