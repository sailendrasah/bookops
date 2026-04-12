import joi from "joi";

export const validateAddBook = (book:any) => {
  return joi.object({
    title: joi.string().trim().min(2).max(100).allow(''),
    author: joi.string().trim().min(2).max(50).allow(''),
    isbn: joi.string().trim().allow(''),
    genre: joi.string().trim().optional().allow(''),
    totalCopies: joi.number().min(0).allow(''),
    availableCopies: joi.number().min(0).allow(""),
    shelfLocation: joi.string().trim().optional().allow(''),
    isActive: joi.boolean().allow('')
  }).validate(book);
};

export const validateUpdateBook = (book:any) => {
  return joi.object({
    book_id: joi.string().required(),
    title: joi.string().trim().min(2).max(100).allow(''),
    author: joi.string().trim().min(2).max(50).allow(''),
    isbn: joi.string().trim().allow(''),
    genre: joi.string().trim().optional().allow(''),
    totalCopies: joi.number().min(0).allow(''),
    availableCopies: joi.number().min(0).allow(""),
    shelfLocation: joi.string().trim().optional().allow(''),
    isActive: joi.boolean().allow('')
  }).validate(book);
};