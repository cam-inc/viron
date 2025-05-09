import { z } from 'zod';

export const endpointId = z.string().min(1).max(64);
export const email = z.string().email();
// TODO: Support localhost.
//export const url = z.string().url();
export const url = z.string().min(1);
