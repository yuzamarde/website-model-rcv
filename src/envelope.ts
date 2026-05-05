import { z, type ZodTypeAny } from 'zod';

/**
 * Standard response envelope used by every /api/public/user/* endpoint.
 *
 *   { "message": "...", "data": <payload> }
 *
 * `data` is generic — pass any schema to build a fully-typed envelope:
 *
 *   const BasicInfoEnvelope = apiEnvelope(BasicInfoSchema);
 *   type BasicInfoEnvelopeT = z.infer<typeof BasicInfoEnvelope>;
 */
export const apiEnvelope = <T extends ZodTypeAny>(data: T) =>
    z.object({
        message: z.string(),
        data,
    });

export type ApiEnvelope<T> = {
    message: string;
    data: T;
};
