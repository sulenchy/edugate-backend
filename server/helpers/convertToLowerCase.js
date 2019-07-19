// reference: https://gist.github.com/orcaman/dd40b04e0e42eed841d7

export const toLowerCase = (obj) => {
    if (!obj) {
        return;
    }
    if(typeof obj === 'string') return obj.toLocaleLowerCase();
    
    if (typeof obj !== 'Object' && typeof obj !== 'object') {
        return;
    }
    const keys = Object.keys(obj);
    const result = {};
    keys.map(function(k, v) {
        if (typeof k === 'string') {
            if (typeof obj[k] === 'string') {
                result[k.toLowerCase()] = obj[k].toLowerCase();
            } else {
                // if the node is an object, perform the same process over that node
                if (typeof obj[k] === 'Object' || typeof obj[k] === 'object') {
                    result[k.toLowerCase()] = toLowerCase(obj[k]);
                } else {
                    result[k.toLowerCase()] = obj[k];
                }
            }
        }
    });
    return result;
}