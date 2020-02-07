const Cloudant = require('../../helpers/cloudant');

const create = (db) => (data) => {
    return new Promise((resolve, reject) => {
        db.set(data).then((response) => {
            resolve(response);
        }).catch((error) => {
            reject(error);
        });
    });
};

const load = (db) => (selectors) => {
    return new Promise((resolve, reject) => {
        db.find(selectors).then((response) => {
            resolve(response.docs);
        }).catch((error) => {
            reject(error);
        });
    });
};

module.exports = (config) => {
    const instance = Cloudant(config);
    const db = instance.interface(config.collection);

    return {
        create: create(db),
        load: load(db)
    };
};
