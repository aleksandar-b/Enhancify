
const enhancify = (obj) => {
  const beforeHooks = [];
  const afterHooks = [];

  const isMethod = (prop) => {
    return typeof prop === 'function'
  }

  const handleBeforeHooks = ({ propKey, args }) => {
      beforeHooks.forEach(({name, callback}) => { 
        if(propKey === name || name === '*') callback({ propKey, args });
      });
  };

  const handleAfterHooks = ({ propKey, args, result }) => {
      afterHooks.forEach(({name, callback}) => { 
        if(propKey === name || name === '*') callback({ propKey, args, result })
      });
  };
  
  return {
    before(name, callback) {
      beforeHooks.push({ name, callback });
      return this;
    },

    after(name, callback) {
      afterHooks.push({ name, callback });
      return this;
    },

    build() {
      return new Proxy(obj, {
        get(target, propKey, receiver) {
          const origMethod = target[propKey];

          if(!isMethod(target[propKey])) return target[propKey];
  
          return function (...args) {
              handleBeforeHooks({ propKey, args });
              const result = origMethod.apply(target, args);
              handleAfterHooks({ propKey, args, result });

              console.log(result);
              return result;
          };
        }
      });
    }
  };
};

module.exports = enhancify;