const express = require("express")
const router = express.Router()

const {
    validateCourseData,
    courseValidation
} = require("../validation/index")

const {
    getCourses,
    createCourse,
    editCourse,
    deleteCourse
} = require("../db/index");

router
    .route("/")
    .get(getCourses)
    .post([validateCourseData, courseValidation, createCourse])
router
    .route("/:id")
    .put([validateCourseData, courseValidation, editCourse])
    .delete(deleteCourse)

module.exports = router