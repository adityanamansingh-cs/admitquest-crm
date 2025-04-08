import Joi from 'joi';

const options = {
    errors: {
        wrap: {
            label: '',
        },
    },
    abortEarly: false,
};

export const validateSignUp = (userData: any) => {
    const schema = Joi.object({
        id: Joi.number()
            .integer()
            .positive()
            .optional()
            .messages({ 'number.base': 'ID must be a number' }),

        name: Joi.string().min(1).max(255).optional().messages({
            'string.min': 'Name should be at least 1 character',
            'string.max': 'Name should not exceed 255 characters',
        }),

        mobile: Joi.string()
            .pattern(/^[6-9]\d{9}$/)
            .required()
            .messages({
                'string.pattern.base':
                    'Mobile number must start with 9-6 and be followed by 9 more digits',
                'any.required': 'Mobile number is required',
            }),

        email: Joi.string().email().max(255).optional().messages({
            'string.email': 'Email format is invalid',
            'string.max': 'Email should not exceed 255 characters',
        }),

        course_id: Joi.number().optional(),
        ip_address: Joi.string().max(45).optional(),
        lead_utm_campaign: Joi.string().max(255).optional(),
        lead_utm_source: Joi.string().max(255).optional(),
        lead_utm_medium: Joi.string().max(255).optional(),
        admitted_institute_id: Joi.number().optional(),
        image: Joi.string().max(255).optional(),
        status: Joi.string().valid('active', 'inactive').default('active'),
    });

    const result = schema.validate(userData, options);
    if (result.error) {
        console.error(
            'Validation errors:',
            result.error.details.map(err => ({
                field: err.path.join('.'),
                message: err.message,
                value: err.context?.value,
            })),
        );
    }
    return result;
};

export const validateSignIn = (userData: any) => {
    const schema = Joi.object({
        mobile: Joi.string()
            .pattern(/^[6-9]\d{9}$/)
            .required(),
    });

    return schema.validate(userData, options);
};

export const validateVerifyOTP = (data: any) => {
    console.log('Validating OTP data:', {
        mobile: data.mobile,
        otp: '******',
    });

    const schema = Joi.object({
        mobile: Joi.string()
            .pattern(/^[6-9]\d{9}$/)
            .required()
            .messages({
                'string.pattern.base':
                    'Mobile number must start with 9-6 and be followed by 9 more digits',
                'any.required': 'Mobile number is required',
            }),
        otp: Joi.string().length(4).required().messages({
            'string.length': 'OTP must be 4 digits',
            'any.required': 'OTP is required',
        }),
    });

    const result = schema.validate(data, options);
    if (result.error) {
        console.error(
            'OTP Validation errors:',
            result.error.details.map(err => ({
                field: err.path.join('.'),
                message: err.message,
                value: err.context?.value,
            })),
        );
    }
    return result;
};

//validateRefreshToken
export const validateRefreshToken = (data: any) => {
    const schema = Joi.object({
        refreshToken: Joi.string().required(),
    });

    return schema.validate(data, options);
};

export const validateResendOTP = (data: any) => {
    const schema = Joi.object({
        mobile: Joi.string()
            .pattern(/^[6-9]\d{9}$/)
            .required()
            .messages({
                'string.pattern.base':
                    'Mobile number must start with 9-6 and be followed by 9 more digits',
                'any.required': 'Mobile number is required',
            }),
    });

    return schema.validate(data, options);
};
