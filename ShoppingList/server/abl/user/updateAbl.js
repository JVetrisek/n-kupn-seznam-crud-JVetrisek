const Ajv = require('ajv');
const ajv = new Ajv();

const userDao = require("../../dao/user-dao.js");

const userUpdateSchema = {
  type: "object",
  properties: {
    _id: { type: "string" },
    name: { type: "string" },
    email: { type: "string", format: "email" },
  },
  required: ["_id"],
  additionalProperties: false,
};

async function UpdateUser(req, res) {
  try {
    const reqUser = req.body;

    const valid = ajv.validate(userUpdateSchema, reqUser);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    const user = userDao.get(reqUser._id);
    if (!user) {
      res.status(404).json({
        code: "userNotFound",
        message: `User with ID ${reqUser._id} not found`,
      });
      return;
    }

    const updatedUser = { ...user, ...reqUser };
    userDao.update(updatedUser);

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = UpdateUser;
