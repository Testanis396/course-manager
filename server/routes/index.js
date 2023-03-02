const express = require("express")
const router = express.Router()

const {
    getCourses,
    createCourse,
    editCourse,
    deleteCourse
} = require("../db/index");

router
    .route("/")
    .get(getCourses)
    .post(createCourse)
router
    .route("/:id")
    .put(editCourse)
    .delete(deleteCourse)
    
module.exports = router