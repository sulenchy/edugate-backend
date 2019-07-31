import models from '../models';

const { Users } = models;

export const compareSchoolUid = async (user_uid, school_uid) => {
    try {
        const user = await Users.findOne({
            where: {
                user_uid
            }
        });

        if( user.school_uid === school_uid) return true;
    }
    catch (err) {
        return false;
    }
}


export const isUserStatusDeleted = async (user_uid) => {
    try {
        const user = await Users.findOne({
            where: {
                user_uid
            }
        });

        if( user.status === 'deleted' ) return true;
    }
    catch (err) {
        return false;
    }
}

