const isEmpty = require("./isEmpty");
const validator = require("validator");
module.exports = (data) => {
  let errors = {};
  data.name = !isEmpty(data.name) ? data.name : "";
  if (!validator.isLength(data.name, { min: 5, max: 20 })) {
    errors.name =
      "Length of category is minimum of 5 and maximun of 15 caracter";
  }
  if (validator.isEmpty(data.name)) {
    errors.name = "Required name";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
