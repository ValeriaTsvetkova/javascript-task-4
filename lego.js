'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы or и and
 */
exports.isStar = false;

/**
 * Запрос к коллекции
 * @param {Array} collection
 * @params {...Function} – Функции для запроса
 * @returns {Array}
 */

var OPERATIONS_PRIORITY = ['filterIn', 'sortBy', 'select', 'format', 'limit'];

exports.query = function (collection) {
    var copiedCollection = [];
    collection.forEach(function (friend) {
        copiedCollection.push(Object.assign({}, friend));
    });
    if (arguments.length === 1) {
        return copiedCollection;
    }
    var operations = sortOperations([].slice.call(arguments, 1));
    operations.forEach(function (operation) {
        copiedCollection = operation(copiedCollection);
    });

    return copiedCollection;
};

function sortOperations(operations) {
    return operations.sort(function (a, b) {
        return OPERATIONS_PRIORITY.indexOf(a.name) > OPERATIONS_PRIORITY.indexOf(b.name) ? 1 : -1;
    });
}

exports.select = function () {
    var properties = [].slice.call(arguments);

    return function select(copiedCollection) {
        copiedCollection.forEach(function (friend) {
            (Object.keys(friend)).forEach(function (property) {
                if (properties.indexOf(property) === -1) {
                    delete copiedCollection[copiedCollection.indexOf(friend)][property];
                }
            });
        });

        return copiedCollection;
    };

};

exports.filterIn = function (property, values) {
    return function filterIn(copiedCollection) {
        return copiedCollection.filter(function (friend) {
            return values.some(function (value) {
                return value === friend[property];
            });
        });
    };
};

exports.sortBy = function (property, order) {
    return function sortBy(copiedCollection) {
        return copiedCollection.sort(function (a, b) {
            if (order === 'asc') {
                return a[property] > b[property] ? 1 : -1;
            }

            return a[property] > b[property] ? -1 : 1;
        });
    };
};

exports.format = function (property, formatter) {
    return function format(copiedCollection) {
        copiedCollection.forEach(function (friend) {
            if (friend.hasOwnProperty(property)) {
                friend[property] = formatter(friend[property]);
            }

            return friend;
        });

        return copiedCollection;
    };
};

exports.limit = function (count) {
    return function limit(copiedCollection) {
        return copiedCollection.slice(0, count);
    };
};

if (exports.isStar) {


    exports.or = function () {
        return;
    };


    exports.and = function () {
        return;
    };
}
