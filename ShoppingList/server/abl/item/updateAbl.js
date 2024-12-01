const Ajv = require('ajv');
const ajv = new Ajv();

const itemDao = require("../../dao/item-dao.js");
const memberValidation = require("../../dao/user-dao").memberValidation;

const itemUpdateSchema = {
  type: "object",
  properties: {
    _id: { type: "string" },
    shoppingListId: { type: "string" },
    name: { type: "string" },
    description: { type: "string" },
    quantity: { type: "integer", minimum: 1 },
  },
  required: ["_id", "shoppingListId"],
  additionalProperties: false,
};

async function UpdateItem(req, res) {
  try {
    const reqItem = req.body;

    // Validate input data
    const valid = ajv.validate(itemUpdateSchema, reqItem);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    // Validate user membership
    const isMember = await memberValidation(req.user._id, reqItem.shoppingListId);
    if (!isMember) {
      res.status(403).json({
        code: "forbidden",
        message: "You do not have access to this shopping list.",
      });
      return;
    }

    // Find and update the item
    const item = itemDao.get(reqItem._id);
    if (!item) {
      res.status(404).json({
        code: "itemNotFound",
        message: `Item with ID ${reqItem._id} not found`,
      });
      return;
    }

    const updatedItem = { ...item, ...reqItem };
    itemDao.update(updatedItem);

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = UpdateItem;
