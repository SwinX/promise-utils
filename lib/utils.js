'use strict';
var q = require('q'),
    _ = require('lodash');

exports.sequence = function sequence(funcs) {
    return funcs.reduce(q.when, q());
};

exports.seqMap = function seqMap(array, callback) {
    return exports.sequence(array.map(function(elem) {
        return function() {
            return callback(elem);
        };
    }));
};

exports.waitForResults = function(promises) {
    return q.allSettled(promises)
        .then(function(results) {
            var rejected = _.find(results, {state: 'rejected'});
            if (rejected) {
                return q.reject(rejected.reason);
            }
        });
};
