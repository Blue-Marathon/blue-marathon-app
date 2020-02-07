const errorHandler = require('./errorHandler');

const generateResponses = responses => {
    const generateResponse = method => (res, status, data, error) => {
        const statusCode = (!error) ? responses[method][status].status : 500;
        let message = '';
        if (statusCode === 500) {
            message = {
                error: errorHandler(error)
            };
        } else {
            message = {
                ...data,
                ...responses[method][status]
            };
        }
        return res
            .status(statusCode)
            .json(message);
    };

    const methods = {};
    for (let method in responses) {
        methods[method] = generateResponse(method);
    }
    return methods;
};  

module.exports = (responses) => generateResponses(responses);
