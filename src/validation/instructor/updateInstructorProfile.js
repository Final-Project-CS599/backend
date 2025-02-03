import Joi from 'joi';

export const updateInstructorProfileValidation = {
  body: Joi.object({
    phoneNumbers: Joi.array()
      .optional()
      .items(Joi.string().min(1).trim().messages({
        'string.base': 'Each phone number must be a string',
        'string.empty': 'Each phone number must be a non-empty string',
      }))
      .custom((value, helpers) => {
        if (value.length > 0) {
          const isValid = value.every((phone) => typeof phone === 'string' && phone.trim().length > 0);
          if (!isValid) {
            return helpers.message('Each phone number must be a non-empty string');
          }
        }
        return value;
      }),

    password: Joi.string()
      .optional()
      .min(8)
      .messages({
        'string.base': 'Password must be a string',
        'string.min': 'Password must be at least 8 characters long',
      })
      .regex(/[a-zA-Z0-9]/)
      .messages({
        'string.pattern.base': 'Password must contain letters and numbers',
      }),
  }),
};
