import models from '../models';

const { Results } = models;

export const isResultStatusDeleted = async (options) => {
    try {
        const results = await Results.findAll(
            options
        );

        if( results.status === 'deleted' ) return true;
    }
    catch (err) {
        return false;
    }
}