const Ajv = require("ajv");
const ajv = new Ajv();

const shoppingListDao = require("../../dao/shoppingLIst-dao");

const listByUserSchema = {
  type: "object",
  properties: {
    userId: { type: "string" },
  },
  required: ["userId"],
  additionalProperties: false,
};

async function listByUser(req, res) {
  try {
    const reqParam = req.query?.userId ? req.query : req.body;

    const valid = ajv.validate(listByUserSchema, reqParam);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    const shoppingLists = shoppingListDao.listByUser(reqParam.userId);
    if (!shoppingLists || shoppingLists.length === 0) {
      res.status(404).json({
        code: "noShoppingListsFound",
        message: `No shopping lists found for user with ID ${reqParam.userId}`,
      });
      return;
    }

    res.json(shoppingLists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = listByUser;
