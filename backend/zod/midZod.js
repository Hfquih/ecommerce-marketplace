const { ZodError } = require('zod');

const validate = (schema) => {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      console.log(error);
      console.log(req.body);

      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          errors: error.issues.map((issue) => ({
            field: issue.path.join('.'),
            msg: issue.message,
          })),
        });
      }

      next(error);
    }
  };
};

module.exports = validate