'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы or и and
 */
exports.isStar = true;

/**
 * Запрос к коллекции
 * @param {Array} collection
 * @params {...Function} – Функции для запроса
 * @returns {Array}
 */

var OPERATIONS_PRIORITY = {
    'filterIn': 0,
    'or': 1,
    'and': 2,
    'sortBy': 3,
    'select': 4,
    'format': 5,
    'limit': 6 };

exports.query = function (collection) {
    var copiedCollection = copyCollection(collection);
    if (arguments.length === 1) {
        return copiedCollection;
    }
    var operations = sortOperations([].slice.call(arguments, 1));
    operations.forEach(function (operation) {
        copiedCollection = operation(copiedCollection);
    });

    return copiedCollection;
};

function copyCollection(original) {
    return original.map(function (element) {
        return Object.assign({}, element);
    });
}

function sortOperations(operations) {
    return operations.sort(function (a, b) {
        return OPERATIONS_PRIORITY[a.name] - OPERATIONS_PRIORITY[b.name];
    });
}

exports.select = function () {
    var properties = [].slice.call(arguments);

    return function select(collection) {
        var copiedCollection = collection.slice();
        copiedCollection.forEach(function (element) {
            (Object.keys(element)).forEach(function (property) {
                if (properties.indexOf(property) === -1) {
                    delete copiedCollection[copiedCollection.indexOf(element)][property];
                }
            });
        });

        return copiedCollection;
    };

};

exports.filterIn = function (property, values) {
    return function filterIn(collection) {
        return collection.filter(function (element) {
            return values.some(function (value) {
                return value === element[property];
            });
        });
    };
};

exports.sortBy = function (property, order) {
    return function sortBy(collection) {
        var copiedCollection = copyCollection(collection);

        return copiedCollection.sort(function (a, b) {
            var resultForASC = a[property] > b[property] ? 1 : -1;
            var resultForDESC = a[property] > b[property] ? -1 : 1;

            return order === 'asc' ? resultForASC : resultForDESC;
        });
    };
};

exports.format = function (property, formatter) {
    return function format(collection) {
        var copiedCollection = copyCollection(collection);
        copiedCollection.forEach(function (element) {
            if (element.hasOwnProperty(property)) {
                element[property] = formatter(element[property]);
            }

            return element;
        });

        return copiedCollection;
    };
};

exports.limit = function (count) {
    return function limit(collection) {
        return collection.slice(0, count);
    };
};

if (exports.isStar) {


    exports.or = function () {
        var criterions = [].slice.call(arguments);

        return function or(collection) {
            return collection.filter(function (element) {
                return criterions.some(function (criterion) {
                    return (criterion(collection).indexOf(element) !== -1);
                });
            });
        };
    };


    exports.and = function () {
        var criterions = [].slice.call(arguments);

        return function and(collection) {
            criterions.forEach(function (criterion) {
                collection = criterion(collection);
            });

            return collection;
        };
    };

}
