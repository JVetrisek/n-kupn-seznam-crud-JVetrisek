const Ajv = require("ajv");
const ajv = new Ajv();
require("ajv-formats")(ajv);
const userDao = require("../../dao/user-dao.js");

const userSchema = {
    type: "object",
    properties: {
        name: { type: "string" },
        email: { 
            type: "string", 
            format: "email"
        }
    },
    required: ["name", "email"],
    additionalProperties: false
};

async function CreateUser(req, res) {
  try {
    let newUser = req.body || req.query;

    const valid = ajv.validate(userSchema, newUser);
    if (!valid) {
      return res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
    }

    newUser = await userDao.create(newUser);

    return res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ 
      message: error.message || "An error occurred while creating the user",
      error: error 
    });
  }
}

module.exports = CreateUser;
