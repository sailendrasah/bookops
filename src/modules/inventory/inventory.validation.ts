import joi from "joi";

export const validateInventory = (data: any) => {
  return joi.object({
    id: joi.string(),
    bookId: joi.string(),
book_conditionId:joi.string(),
    book_condition: joi.string()
      .valid("NEW", "GOOD", "DAMAGED", "LOST")
      .required().allow(""),

    note: joi.string()
      .trim()
      .max(200)
      .allow("")
      .optional(),

    book_status: joi.string()
      .valid("AVAILABLE", "ISSUED")
      .allow('')
  }).validate(data);
};