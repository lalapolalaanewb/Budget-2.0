// import @hapi/joi
const joi = require('@hapi/joi')

// register validation scheme
const registerValidation = data => {
    
    // validation Scheme
    const schema = joi.object({
        name: {
            firstName: joi
                        .string()
                        .min(4)
                        .required(),
            lastName: joi
                        .string()
                        .min(4)
                        .required()
        },
        email: joi
                .string()
                .min(6)
                .required()
                .email(),
        password: joi
                .string()
                .min(6)
                .required()
    })

    // validation
    return schema.validate(data)
}

// login validation scheme
const loginValidation = data => {

    // validation Scheme
    const scheme = joi.object({
        inputEmail: joi
                    .string()
                    .min(6)
                    .required()
                    .email(),
        inputPassword: joi
                    .string()
                    .min(6)
                    .required()
    })

    // validation
    return scheme.validate(data)
}

// export loginValidation
module.exports.loginValidation = loginValidation
// export registerValidation
module.exports.registerValidation = registerValidation