export const requireFields = (body, fields) => {
  const missing = fields.filter((field) => body[field] === undefined || body[field] === "");

  if (missing.length > 0) {
    const error = new Error(`Missing required fields: ${missing.join(", ")}`);
    error.statusCode = 400;
    throw error;
  }
};

export const assertOneOf = (value, allowed, fieldName) => {
  if (!allowed.includes(value)) {
    const error = new Error(`${fieldName} must be one of: ${allowed.join(", ")}`);
    error.statusCode = 400;
    throw error;
  }
};

export const assertNumberRange = (value, fieldName, min, max) => {
  if (typeof value !== "number" || Number.isNaN(value) || value < min || value > max) {
    const error = new Error(`${fieldName} must be a number between ${min} and ${max}`);
    error.statusCode = 400;
    throw error;
  }
};
