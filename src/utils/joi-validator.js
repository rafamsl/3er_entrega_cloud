import joi from "joi";

const product = joi.object({
  title: joi.string().min(3).max(45).required(),
  description: joi.string().min(3).max(300).required(),
  code: joi.string().min(3).max(45).required(),
  thumbnail: joi.string().min(3).max(150).required(),
  price: joi.number().required(),
  stock: joi.number().required(),
  timestamp: joi.string().required(),
});

const user = joi.object({
  email: joi.string().email({ tlds: { allow: false } }).required(),
  password: joi.string(),
  telefono: joi.string().min(7).max(20).required(),
  direccion: joi.string().min(3).max(50).required(),
  nacimiento: joi.date().required(),
  timestamp: joi.string().required(),
});

export const JOI_VALIDATOR = { product, user };