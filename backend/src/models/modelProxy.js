const mongoose = require('mongoose');
const { getStatus } = require('../config/db');
const fallbackModels = require('./fallbackStore');

function createModelProxy(modelName, mongooseModel) {
  return new Proxy(mongooseModel, {
    get(target, prop, receiver) {
      const isMongooseConnected = mongoose.connection.readyState === 1;
      const status = getStatus();

      // If Mongoose is not in connected state or explicitly marked as using fallback
      if (!isMongooseConnected || status.usingFallback) {
        const fallback = fallbackModels[modelName];
        if (fallback && typeof fallback[prop] === 'function') {
          return fallback[prop].bind(fallback);
        }
        if (fallback && prop in fallback) {
          return fallback[prop];
        }
      }

      const val = Reflect.get(target, prop, receiver);
      if (typeof val === 'function') {
        return val.bind(target);
      }
      return val;
    },
    apply(target, thisArg, argumentsList) {
      const isMongooseConnected = mongoose.connection.readyState === 1;
      const status = getStatus();

      if (!isMongooseConnected || status.usingFallback) {
        const data = argumentsList[0] || {};
        return {
          ...data,
          save: async function () {
            return fallbackModels[modelName].create(this);
          },
        };
      }
      return Reflect.apply(target, thisArg, argumentsList);
    },
  });
}

module.exports = createModelProxy;
