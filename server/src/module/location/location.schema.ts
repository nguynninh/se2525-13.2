import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

const NAME_REGEX = /^[\p{L}\s'-]+$/u;

export const ProvinceCodeParamSchema = z.object({
    code: z.string().trim().min(1, 'shipping:province_code_required'),
});

export const WardIdParamSchema = z.object({
    id: z.string().uuid('shipping:ward_id_invalid'),
});

export const ProvinceResponseSchema = z
    .object({
        code: z.string(),
        name: z.string(),
    })
    .strict()
    .openapi('ProvinceResponse');

export const WardResponseSchema = z
    .object({
        code: z.string(),
        name: z.string(),
    })
    .strict()
    .openapi('WardResponse');

export const AddressPayloadSchema = z
    .object({
        address_line: z.string().trim().min(1, 'shipping:address_line_required'),
        ward_id: z.string().uuid('shipping:ward_id_invalid'),
    })
    .strict()
    .openapi('AddressPayload');

export const CreateShippingAddressSchema = z
    .object({
        receiver_name: z
            .string()
            .trim()
            .min(1, 'shipping:receiver_name_required')
            .regex(NAME_REGEX, 'shipping:receiver_name_invalid'),
        receiver_phone: z.string().trim().min(1, 'shipping:receiver_phone_required'),
        address: AddressPayloadSchema,
        is_default: z.boolean().optional(),
    })
    .strict()
    .openapi('CreateShippingAddress');

export const UpdateShippingAddressSchema = z
    .object({
        receiver_name: z
            .string()
            .trim()
            .min(1, 'shipping:receiver_name_required')
            .regex(NAME_REGEX, 'shipping:receiver_name_invalid')
            .optional(),
        receiver_phone: z.string().trim().min(1, 'shipping:receiver_phone_required').optional(),
        address: AddressPayloadSchema.partial().optional(),
        is_default: z.boolean().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, 'shipping:update_body_empty')
    .strict()
    .openapi('UpdateShippingAddress');

export const ShippingAddressResponseSchema = z
    .object({
        id: z.string().uuid(),
        receiver_name: z.string(),
        receiver_phone: z.string(),
        is_default: z.boolean(),
        created_at: z.string().datetime(),
        updated_at: z.string().datetime(),
        address: z.object({
            address_line: z.string(),
            ward: z.object({
                code: z.string(),
                name: z.string(),
                province: z.object({
                    code: z.string(),
                    name: z.string(),
                }),
            }),
        }),
    })
    .strict()
    .openapi('ShippingAddressResponse');
