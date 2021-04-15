import { string as yupString } from 'yup';

export const endpointId = yupString().min(1).max(64);
export const email = yupString().email();
// TODO: Support localhost.
//export const url = yup.string().url();
export const url = yupString();
