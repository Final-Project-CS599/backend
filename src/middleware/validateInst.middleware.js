export const validateWithSchema = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false }); 

    if (error) {
      return res.status(400).json({ 
        errors: error.details.map(detail => ({
          message: detail.message,
          path: detail.path,
        }))
      });
    }

    next();
  };
};
