import Joi from "joi";

export const validateReservation = (data: any) => {
  return Joi.object({
    
    member_id: Joi.string().allow(""),

    bookId: Joi.string().allow(""),

    book_name: Joi.string().allow(""),

    totalBook_reserved: Joi.date().allow(""),
    reserved_date: Joi.date()
      .allow(""),

  }).validate(data);
};