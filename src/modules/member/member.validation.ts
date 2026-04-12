import Joi from "joi";

export const validatemember = (data: any) => {
  return Joi.object({
   
    memberShipType: Joi.string()
      .valid("BASIC", "PREMIUM")
      .allow(''),

    
  }).validate(data);
};




export const validateUpdateMember = (data: any) => {
  return Joi.object({

    _id: Joi.string().required(),

    name: Joi.string()
      .trim()
      .min(2)
      .max(50)
      .allow(''),

    Address: Joi.string()
      .trim()
      .min(5)
      .allow(''),

    memberShipType: Joi.string()
      .valid("BASIC", "PREMIUM")
      .allow('')

  }).validate(data);
};