const Ajv = require("ajv");
const ajv = new Ajv();

const shoppingListDao = require("../../dao/shoppingLIst-dao");
const userDao = require("../../dao/user-dao")

const shoppingListSchema = {
    type: "object",
    properties: {
        title: { type: "string" },
        ownerId: { type: "string" },
        membersIds: {
            type: "array",
            items: {
                type: "string"
            }
        },
        archive: { type: "boolean" }
    },
    required: ["title", "ownerId"],
    additionalProperties: false,
}

async function CreateShoppingList(req, res) {
    try {
        let newShoppingList = req.body;

        const valid = ajv.validate(shoppingListSchema, newShoppingList);
        if (!valid) {
            res.status(400).json({
                code: "dtoInIsNotValid",
                message: "dtoIn is not valid",
                validationError: ajv.errors
            });
            return;
        }
        const ownerValidation = userDao.get(newShoppingList.ownerId);
        if (!ownerValidation){
            res.status(404).json({
                code: "dtioInShoppingListIdIdNotExists",
                message: `ShoppingList ${newShoppingList._id} does not exists`,
                validationError: ajv.error
            });
            return;
        }

        newShoppingList = shoppingListDao.create(newShoppingList);
        res.json(newShoppingList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = CreateShoppingList;