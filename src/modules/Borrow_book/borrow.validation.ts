import Joi from "joi";

export const validateBorrow = (data: any) => {
  return Joi.object({
    
    member_id: Joi.string().allow(""),
    borrowId: Joi.string().allow(""),
    _id: Joi.string().allow(""),

    book_id: Joi.string().allow(""),

    issueDate: Joi.string().allow(""),

    lastDate: Joi.string().allow(""),

    returnDate: Joi.number().allow(""),

    status: Joi.boolean().allow(""),

    Book_status: Joi.string().allow(""),

    renewCount: Joi.number().allow("")

  }).validate(data);
};