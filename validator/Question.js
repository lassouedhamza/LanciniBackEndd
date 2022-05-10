const isEmpty = require("./isEmpty");
const validator = require('validator')
module.exports = (data) => {
  let errors = {};

  data.category = !isEmpty(data.category) ? data.category : "";
  data.question = !isEmpty(data.question) ? data.question : "";
  data.response = !isEmpty(data.response) ? data.response : "";

  if (validator.isEmpty(data.category)) {
    errors.category = "Required category";
  }
  if (validator.isEmpty(data.question)) {
    errors.question = "Required question";
  }
  if (validator.isEmpty(data.response)) {
    errors.response = "Required response";
  }

  return {
      errors,
      isValid: isEmpty(errors)
  }
};
