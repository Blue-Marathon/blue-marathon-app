const errors = require('./list');

const resolve = originalError => {
    let result = false;
    if (originalError && originalError.message) {
      errors.forEach(error => {
        if (originalError.message.match(error.name)) {
          result = new Error(error.message);
        }
      });
    }
    return (result !== false) ? result : originalError;
  };

module.exports = resolve;
