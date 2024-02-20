const data = require(`${__dirname}/../../endpoints.json`);

exports.fetchEndpoints = () => {
    return data;
  };