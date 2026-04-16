import Joi from "joi";

export const validateSubscriptionPlan = (data: any) => {
  return Joi.object({

    name: Joi.string()
      .trim()
      .min(2)
      .max(50)
      .required(),

    stripe_price_id: Joi.string()
      .trim()
      .required(),

    trial_days: Joi.number()
      .min(0)
      .required(),

    have_trial: Joi.boolean()
      .optional(),

    amount: Joi.number()
      .min(0)
      .required(),

    type: Joi.number()
    //  1 = monthly, 2 = yearly 3 =lifeTime
      .required()

  }).validate(data);
};