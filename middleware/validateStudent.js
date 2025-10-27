import Joi from "joi";

const subjects = [
  "Math",
  "Physics",
  "Chemistry",
  "Biology",
  "MERN",
  "MEAN",
  "Data Science",
  "Java",
  "Python",
  "React",
];

export const validateStudent = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    age: Joi.number().positive().integer().required(),
    course: Joi.string()
      .valid(...subjects)
      .required(),
  });

  const { error } = schema.validate(req.body);
  if (error)
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });

  next();
};
