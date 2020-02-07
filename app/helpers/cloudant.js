const cloudant = require('@cloudant/cloudant');//cloudant middleware

module.exports = ({ host, username, password }) => {
    const instance = cloudant({//create cloudant instance for given credentials
        host,
        account: username,
        password: password
    });

    const createInterface = (collectionName) => {
        const db = instance.db.use(collectionName);//collection handler

    //find documents
        const find = (selectors) => {
            selectors = selectors || {
                "selector": {
                    "_id": {
                        "$gt": null
                    }
                }
            };
            return new Promise((resolve, reject) => {
                db.find(selectors, (error, response) => {
                    if(error){
                        reject(error);
                    }
                    resolve(response);
                });
            });
        };

    //get document
        const get = (id, options) => {
            options = options || {};
            return new Promise((resolve, reject) => {
                db.get(id, options, (error, response) => {
                    if(error){
                        reject(error);
                    }
                    resolve(response);
                });
            });
        };

    //insert document
        const set = (data) => {
            return new Promise((resolve, reject) => {
                db.insert(data, (error, response) => {
                    if(error){
                        reject(error);
                    }
                    resolve(response);
                });
            });
        };

    //update document
        const update = (id, data) => {
            return new Promise((resolve, reject) => {
                db.get(id, (error, existing) => { 
                    if(error){
                        reject(error);
                    }
                    data._rev = existing._rev;
                    db.insert(data, id, (error, response) => {
                        if(error){
                            reject(error);
                        }
                        resolve(response);
                    });
                });
            });
        };

    //delete document
        const remove = (id, rev) => {
            return new Promise((resolve, reject) => {
                db.destroy(id, rev, (error, response) => {
                    if(error){
                        reject(error);
                    }
                    resolve(response);
                });
            });
        };

    //list
        const list = (query) => {
            return new Promise((resolve, reject) => {
                db.list(query, (error, data) => {
                    if(error){
                        reject(error);
                    }
                    resolve(data);

                });
            });
        };

    //bulk insert
        const bulk = (data) => {
            let payload = {
                docs: data
            };
            return new Promise((resolve, reject) => {
                db.bulk(payload, (error, response) => {
                    if(error){
                        reject(error);
                    }
                    resolve(response);
                });
            });
        };

        return {
            find: find,
            get: get,
            set: set,
            update: update,
            remove: remove,
            list: list,
            bulk: bulk,
        };
    };
    
    return {
        instance,
        interface: createInterface
    };
};
