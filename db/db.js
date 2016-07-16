'use strict';

var db = {};

// Authenticate
db.authenticate = function (consumer, secret, callback) {
    if (consumer === 'xvz1evFS4wEEPTGEFPHBog' &&
            secret === 'L8qq9PZyRg6ieKGEKhZolGC0vJWLw8iEJ88DRdyOg') {
        var user = {
            id: consumer
        };
        callback(null, user);
    } else {
        callback(new Error('Incorrect consumer key or secret'), null);
    }
};

db.updateOrCreate = function(user, callback) {
    callback(null, user);
};

module.exports = db;
