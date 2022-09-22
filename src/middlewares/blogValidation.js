
import joi from '@hapi/joi';

const articleValidation = joi.object ({

    title: joi.string().required().label("Title").regex(/^[A-Za-z ]+$/).messages({
        "string.pattern.base": "The title can not include numbers and special characters",
        "string.empty": "The title field can not be empty"
    }),
    authorName: joi.string().required().label("Athor Name").regex(/^[A-Za-z ]+$/).messages({
        "string.pattern.base": "The title can not include numbers and special characters",
        "string.empty": "The name field can not be empty"
    }),
    category: joi.string().required().label("category").regex(/^[A-Za-z ]+$/).messages({
        "string.pattern.base": "The title can not include numbers and special characters",
        "string.empty": "The category field can not be empty"
    }),
    faculty: joi.string().required().label("category").regex(/^[A-Za-z ]+$/).messages({
        "string.pattern.base": "The title can not include numbers and special characters",
        "string.empty": "The faculty field can not be empty"
    }),
    authorImage: joi.string().label("author").messages({
        "string.empty": "Please add the author's picture"
    }),
    body: joi.string().required().messages({
        "string.empty": "The body field can not be empty"
    }),
    imgLink: joi.string().label("author").messages({
        "string.empty": "Please add the post's picture"
    })

})

export default  articleValidation;