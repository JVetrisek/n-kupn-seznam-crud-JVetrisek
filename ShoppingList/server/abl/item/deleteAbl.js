const Ajv = require('ajv');
const ajv = new Ajv();

const itemDao = require("../../dao/item-dao.js");
const userDao = require("../../dao/user-dao.js");

const itemSchema = {
    type: "object",
    properties: {
        _id: { type: "string" },
    },
    required: ["_id"],
    additionalProperties: false,
};

async function DeleteItem(req, res) {
    try {
        const reqItem = req.query?._id ? req.query : req.body;

        const valid = ajv.validate(itemSchema, reqItem);
        if (!valid) {
            res.status(400).json({
                code: "dtoInIsNotValid",
                message: "dtoIn is not valid",
                validationError: ajv.errors,
            });
            return;
        }

        const item = itemDao.get(reqItem._id);
        if (!item) {
            res.status(404).json({
                code: "itemNotFound",
                message: `Item with ID ${reqItem._id} not found.`,
            });
            return;
        }

        // Kontrola, zda má uživatel oprávnění k operaci
        const userId = req.auth?.userId; // Předpokládáme, že uživatel ID je dostupné v `req.auth`
        if (!userId) {
            res.status(401).json({
                code: "unauthorized",
                message: "User is not authorized.",
            });
            return;
        }

        const hasAccess = await userDao.memberValidation(userId, item.shoppingListId);
        if (!hasAccess) {
            res.status(403).json({
                code: "accessDenied",
                message: "User is not allowed to delete this item.",
            });
            return;
        }

        // Odstranění položky
        itemDao.remove(reqItem._id);
        res.json({ message: "Item deleted successfully." });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = DeleteItem;
