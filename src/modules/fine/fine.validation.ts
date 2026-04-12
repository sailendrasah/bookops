import Joi from "joi";

export const validateFine = (data: any) => {
  return Joi.object({
    
    member_id: Joi.string().allow(""),
    borrowId: Joi.string().allow(""),
    _id: Joi.string().allow(""),

    book_id: Joi.string().allow(""),

    fineAmount: Joi.number().allow(""),

    returnDate: Joi.string().allow(""),

    isPaid: Joi.number().allow(""),

    paidDate: Joi.string().allow(""),

    isFineCancel: Joi.number().allow("")

  }).validate(data);
};