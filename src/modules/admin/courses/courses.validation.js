import  joi from 'joi';
import { generalFieldsValidation } from '../../../middleware/validation.middleware.js';


export const addCourses= joi.object().keys({
    adminNid: generalFieldsValidation.nationalID.required(),
    courseName: generalFieldsValidation.course.required(),
    courseType: generalFieldsValidation.course.required(),
    courseDescription: generalFieldsValidation.courseDescription.required(),
    courseCategory: generalFieldsValidation.course.required(),
    courseStartDate: generalFieldsValidation.courseDate.required(),
    courseEndDate: generalFieldsValidation.courseDate.required(),
    instructorName: generalFieldsValidation.userName.required(),
});

export const updateCourses = joi.object().keys({
    adminNid: generalFieldsValidation.nationalID.required(),
    courseNameUpdate: generalFieldsValidation.course.required(),
    courseType: generalFieldsValidation.course.required(),
    courseDescription: generalFieldsValidation.courseDescription.required(),
    courseCategory: generalFieldsValidation.course.required(),
    courseStartDate: generalFieldsValidation.courseDate.required(),
    courseEndDate: generalFieldsValidation.courseDate.required(),
    instructorName: generalFieldsValidation.userName.required(),
    courseName: generalFieldsValidation.course.required(),
})

export const updateCoursesStudent = joi.object().keys({
    studentName: generalFieldsValidation.userName.required(),
    courseName: generalFieldsValidation.course.required()
})

export const deletedCourse = joi.object().keys({
    courseName: generalFieldsValidation.course.required(),
    courseCode: generalFieldsValidation.courseCode.required(),
});


