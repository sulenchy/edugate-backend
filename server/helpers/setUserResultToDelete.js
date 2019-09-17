import models from '../models';


const { Results } = models;

const setUserResultToDelete = async (user_uid) => {

    try {
        const updatedResults = await Results.update(
            { status: 'deleted' },
            {
                where: {
                    user_uid
                },
                returning: true,
            })
            return updatedResults
    }
    catch (err) {
        return false;
    }

}


export default setUserResultToDelete;
