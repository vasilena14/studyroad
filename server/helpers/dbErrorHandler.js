"use strict";

const getCustomErrorMessage = (err) => {
  let output;

  try {
    let fieldName = err.message.substring(
      err.message.lastIndexOf("{") + 1,
      err.message.lastIndexOf("}")
    );
    output = fieldName + " already exists";
  } catch (ex) {
    output = "Field already exists";
  }
  return output;
};

const getErrorMessage = (err) => {
  let message = "";

  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = getCustomErrorMessage(err);
        break;
      default:
        message = "Something went wrong";
    }
  } else {
    for (let errName in err.errors) {
      if (err.errors[errName].message) message = err.errors[errName].message;
    }
  }
  return message;
};

export default { getErrorMessage };
