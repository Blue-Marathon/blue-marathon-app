const Ajv = require('ajv');
const ajv = new Ajv();
const log4js = require('log4js');
const logger = log4js.getLogger('[Schema Validator]');

const getValidator = (schema) => {
    const validate = ajv.compile(schema);
    return (data) => {
        const valid = validate(data);
        if (validate.errors) {
            logger.error(schema.title, validate.errors);
        }
        return valid;
    };
};

module.exports = getValidator;
