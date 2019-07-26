import sendError from '../helpers/sendError.js';
import models from '../models';

const { Users } = models;

export const checkUserIsLoggedIn = (req, res, next) => {
    if (!req.session.user_uid) {
        return sendError(res, 401, 'Please login')
    }
    next();
}

export const checkAdminPrivilege = (req, res, next) => {
    if (!['admin', 'super admin'].includes(req.session.role)) {
        return sendError(res, 401, 'Sorry, you do not have the required privilege')
    }
    next();
}

export const checkStudentPrivilege = (req, res, next) => {
    if (!['student'].includes(req.session.role)) {
        return sendError(res, 401, 'Sorry, you do not have the required privilege')
    }
    next();
}

export const checkTeacherPrivilege = (req, res, next) => {
    const { query } = req.params;
    const { role } = req.session;
    if (!['teacher', 'admin', 'super admin'].includes(role)) {
        return sendError(res, 401, 'Sorry, you do not have the required privilege')
    }

    // protects teacher from getting teachers
    if (role === 'teacher' && query === 'teacher') {
        return sendError(res, 401, 'Sorry, you do not have the required privilege')
    }

    next();
}

export const checkIfUserHasSchool = (req, res, next) => {
    const { school_uid } = req.session;
    if (school_uid === null) {
        return sendError(res, 422, 'School not found. Please register a school')
    }
    next();
}

export const checkUserUpdatePrivilege = async (req, res, next) => {
  try {
    const { role, school_uid } = req.session;
    const { user_uid } = req.body;
    const updateRole = req.body.role;
    let foundUser = await Users.findOne({
      where: {
        user_uid
      }
    })
    if (!foundUser) {
      return sendError(res, 404, 'User not found')
    }
    // Only super admin can update users from different schools
    if (foundUser.school_uid !== school_uid && role !== 'super admin') {
      return sendError(res, 401, 'Sorry, you do not have the required privilege to update user from different school')
    }
    // Only super admin can update super admin or admin, or update role to super admin or admin
    if (role !== 'super admin' && (['admin', 'super admin'].includes(foundUser.role) || ['admin', 'super admin'].includes(updateRole))) {
      return sendError(res, 401, 'Sorry, you do not have the required privilege to update admin or super admin')
    }
    // Only admin & super admin can update teacher
    if (foundUser.role === 'teacher' && !['admin', 'super admin'].includes(role)) {
      return sendError(res, 401, 'Sorry, you do not have the required privilege to update teacher')
    }
    // Only admin & super admin can change students role
    if (foundUser.role === 'student' && updateRole !== 'student' && !['admin', 'super admin'].includes(role)) {
      return sendError(res, 401, 'Sorry, you do not have the required privilege to update role')
    }
    // store current email of user to be updated
    res.locals.foundUserEmail = foundUser.email;
    next();
  } catch (err) {
    sendError(res, 500, err)
  }
}
