'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы or и and
 */
exports.isStar = true;

var OPERATIONS_PRIORITY = {
    'filterIn': 0,
    'or': 1,
    'and': 2,
    'sortBy': 3,
    'select': 4,
    'format': 5,
    'limit': 6
};

/**
 * Запрос к коллекции
 * @param {Array} collection
 * @params {...Function} – Функции для запроса
 * @returns {Array}
 */
exports.query = function (collection) {
    var copiedCollection = copyCollection(collection);
    if (arguments.length === 1) {
        return copiedCollection;
    }
    var operations = sortOperations([].slice.call(arguments, 1));

    return operations.reduce(function (current, operation) {
        return operation(current);
    }, copiedCollection);

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

/**
 * Выбор полей
 * @params {...String}
 * @returns {Function}
 */
exports.select = function () {
    var properties = [].slice.call(arguments);

    return function select(collection) {
        return collection.map(function (element) {
            var person = {};
            properties.forEach(function (property) {
                if (Object.keys(element).indexOf(property) !== -1) {
                    person[property] = element[property];
                }
            });

            return person;
        });
    };
};

/**
 * Фильтрация поля по массиву значений
 * @param {String} property – Свойство для фильтрации
 * @param {Array} values – Доступные значения
 * @returns {Function}
 */
exports.filterIn = function (property, values) {
    return function filterIn(collection) {
        return collection.filter(function (element) {
            return values.indexOf(element[property]) !== -1;
        });
    };
};

/**
 * Сортировка коллекции по полю
 * @param {String} property – Свойство для фильтрации
 * @param {String} order – Порядок сортировки (asc - по возрастанию; desc – по убыванию)
 * @returns {Function}
 */
exports.sortBy = function (property, order) {
    return function sortBy(collection) {
        var copiedCollection = copyCollection(collection);
        var orderValue = order === 'asc' ? 1 : -1;

        return copiedCollection.sort(function (a, b) {
            return (a[property] > b[property] ? 1 : -1) * orderValue;
        });
    };
};

/**
 * Форматирование поля
 * @param {String} property – Свойство для фильтрации
 * @param {Function} formatter – Функция для форматирования
 * @returns {Function}
 */
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

/**
 * Ограничение количества элементов в коллекции
 * @param {Number} count – Максимальное количество элементов
 * @returns {Function}
 */
exports.limit = function (count) {
    return function limit(collection) {
        var copiedCollection = copyCollection(collection);

        return copiedCollection.slice(0, count);
    };
};

if (exports.isStar) {

    /**
     * Фильтрация, объединяющая фильтрующие функции
     * @star
     * @params {...Function} – Фильтрующие функции
     * @returns {Array}
     */
    exports.or = function () {
        var criterions = [].slice.call(arguments);

        return function or(collection) {
            return collection.filter(function (element) {
                return criterions.some(function (criterion) {
                    return criterion([element]).indexOf(element) !== -1;
                });
            });
        };
    };

    /**
     * Фильтрация, пересекающая фильтрующие функции
     * @star
     * @params {...Function} – Фильтрующие функции
     * @returns {Array}
     */
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
