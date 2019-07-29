import models from '../models';


const { Results } = models;

const setUserResultToDelete = async (user_uid) => {

    try {
        const updateResults = await Results.update(
            { status: 'deleted' },
            {
                where: {
                    user_uid
                }
            })
        if (updateResults) {
            return true;
        }
    }
    catch (err) {
        return false;
    }

}


export default setUserResultToDelete;