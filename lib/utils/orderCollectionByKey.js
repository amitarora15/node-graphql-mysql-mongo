const dash = require('lodash');

module.exports = (rows, collection, field, isArray) => {
    let array = rows;
    if(!isArray)
        array = Array.of(rows);
    const group = dash.groupBy(array, field);
    return collection.map(element => {
        let data = group[element];
        let result;
        if(data)
            result =  isArray ? data : data[0];
        else
            result = isArray ? [] : {};
        return result;
    });
};