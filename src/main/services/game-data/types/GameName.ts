import { z } from "zod";

export const GameNameSchema = z.enum([
  "iRacing",
  "Assetto Corsa: Competizione",
  "Assetto Corsa",
  "Emulator",
]);

export type GameName = z.infer<typeof GameNameSchema>;
