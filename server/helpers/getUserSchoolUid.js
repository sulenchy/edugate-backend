import models from '../models';

const { Users } = models;

const compareSchoolUid = async (user_uid, school_uid) => {
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

export default compareSchoolUid;
