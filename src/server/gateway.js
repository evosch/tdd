import 'babel-polyfill';

const services = {};

export default {
  register(name, service) {
    if (typeof services[name] === 'undefined') {
      services[name] = [];
    }
    services[name].push(service);
  },

  service(name, ...args) {
    if (!services[name]) {
      console.log(`no service registered for ${name}`);
      return false;
    }
    console.log(`running ${name} (${services[name].length})`);
    return services[name].reduce((promise, service) => promise.then((result) => {
      if (result === false) {
        console.log(`- calling ${service.name}`);
        return service.call(null, ...args);
      }
      return result;
    }), Promise.resolve(false));
  },
};

