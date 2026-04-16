import Joi from "joi";

export const validateSubscriptionPayment = (data: any) => {
  return Joi.object({

    token_id: Joi.string()
      .trim()
      .required()
      .messages({
        "string.empty": "Token ID is required",
        "any.required": "Token ID is required"
      }),

    plan_price_id: Joi.string()
      .trim()
      .required()
      .messages({
        "string.empty": "Plan Price ID is required",
        "any.required": "Plan Price ID is required"
      })

  }).validate(data);
};