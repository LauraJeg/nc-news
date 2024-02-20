const { fetchEndpoints } = require("../models/endpoints-model")

exports.getEndpoints = (req, res, next) => {
    Promise.all([fetchEndpoints()]).then((result) => {
        res.status(200).send({ endpoints: result[0] });
      });
}