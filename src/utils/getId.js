/**
 * Get the ID from an object that may have _id (MongoDB) or id property
 * @param {Object} obj - Object to extract ID from
 * @returns {string|number|null} The ID value or null if not found
 */
export const getId = (obj) => {
  return obj?._id ?? obj?.id ?? null;
};
