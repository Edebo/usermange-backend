const Joi = require("@hapi/joi");

export const signupSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),
  password: Joi.string().required(),

  confirmPassword: Joi.ref("password"),
  profileImg: Joi.string()
    .alphanum()
    .min(3)
    .max(30),

  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] }
    })
    .required()
});

export const signinSchema = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] }
  }),
  password: Joi.string().required()
});
