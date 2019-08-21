import sendError from '../helpers/sendError.js';
import models from '../models';
import { toLowerCase } from '../helpers/convertToLowerCase';

const { Users, Results } = models;

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
    const { user_uid } = req.query;
    if (!user_uid) return sendError(res, 400, 'No user_uid sent')

    const updateRole = req.body.role;

    const options = {
      where: {
        user_uid
      }
    }

    // Only super admin can access users from different schools
    if (role !== 'super admin') options.where.school_uid = school_uid;

    let foundUser = await Users.findOne(
      options
    )
    if (!foundUser) {
      return sendError(res, 404, 'User not found')
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
    if (foundUser.role === 'student' && (updateRole && updateRole !== 'student') && !['admin', 'super admin'].includes(role)) {
      return sendError(res, 401, 'Sorry, you do not have the required privilege to update role')
    }
    // store current email of user to be updated
    res.locals.foundUserEmail = foundUser.email;
    next();
  } catch (err) {
    sendError(res, 500, err)
  }
}

export const checkResultUpdatePrivilege = async (req, res, next) => {
  try {
    const { role, school_uid } = req.session;
    const { result_uid } = req.query;
    if (!result_uid) return sendError(res, 400, 'No result id sent')

    const options = {
      where: {
        result_uid
      }
    };

    // Only super admin can access results from different schools
    if (role !== 'super admin') options.where.school_uid = school_uid;

    let foundResult = await Results.findOne(
      options
    )
    if (!foundResult) return sendError(res, 404, 'Result not found')

    res.locals.student_result_id = foundResult.student_result_id;
    next();
  } catch (err) {
    sendError(res, 500, err)
  }
}

export const checkUserDeletePrivilege = async (req, res, next) => {
  try {
    const { role, school_uid } = req.session;
    const { user_uid } = req.query;

    if (!user_uid) return sendError(res, 400, 'No user id sent')

    const options = {
      where: {
        user_uid,
        status: 'active',
      }
    }

    // Only super admin can access users from different schools
    if (role !== 'super admin') options.where.school_uid = school_uid;

    let foundUser = await Users.findOne(
      options
    );

    if (!foundUser) return sendError(res, 404, 'User not found')

    // Only super admin can delete admins or super admins
    if (['super admin', 'admin'].includes(foundUser.role) && role !== 'super admin') {
      return sendError(res, 401, 'Sorry, you do not have the required privilege to delete user with this role')
    }
    next();
  } catch (err) {
    sendError(res, 500, err)
  }
}

export const checkResultDeletePrivilege = async (req, res, next) => {
  try {
    const { role, school_uid } = req.session;
    const { result_uid, user_uid, subject, exam, term, year } = toLowerCase(req.query);
    const resultOptions = { result_uid, user_uid, subject, exam, term, year }

    const options = {
      where: {
        status: 'active'
      },
      returning: true,
    }

    Object.keys(resultOptions).forEach(x => {
      if (resultOptions[x]) options.where[x] = resultOptions[x]
    })

    // Only super admin can access results from different schools
    if (role !== 'super admin') options.where.school_uid = school_uid;

    const results = await Results.findAll(
        options
    );

    if (!results.length) return sendError(res, 404, 'Results not found')
    res.locals.options = options;
    next()
  } catch (err) {
    sendError(res, 500, err)
  }
}
