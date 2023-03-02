const { check, validationResult } = require("express-validator")

exports.validateCourseData = [
    check("subject").isString().trim().notEmpty().withMessage("Subject must be filled"),
    check("number").notEmpty().isInt({min: 1}).withMessage("Number must be a positive whole number"),
    check("name").isString().trim().notEmpty().withMessage("Name must be filled"),
    check("credits").notEmpty().isFloat({min: 0}).withMessage("Credits must be a non-negative number"),
    check("grade").notEmpty().isString().isLength({ min: 1, max: 2 }).withMessage("Grade must be selected"),
    check("date").notEmpty().toDate().withMessage("Date must be filled"),
]

exports.courseValidation = (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        console.log(errors.array())
        return res.status(422).json({ errors: errors.array() })
    }
    next()
}


