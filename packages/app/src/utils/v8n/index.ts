import * as yup from 'yup';

export const endpointId = yup.string().min(1).max(64);
export const email = yup.string().email();
export const url = yup.string().url();
