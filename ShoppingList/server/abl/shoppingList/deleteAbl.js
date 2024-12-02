const Ajv = require('ajv');
const ajv = new Ajv();

const shoppingListDao = require("../../dao/shoppingLIst-dao");
const userDao = require("../../dao/user-dao.js");

const shoppingListSchema = {
    type: "object",
    properties: {
        _id: { type: "string" },
        userId: { type: "string" },
    },
    required: ["_id", "userId"],
    additionalProperties: false,
};

async function DeleteshoppingList(req, res) {
    try {
        const reqShoppingList = req.query?._id ? req.query : req.body;

        const val_id = ajv.validate(shoppingListSchema, reqShoppingList);
        if (!val_id) {
            res.status(400).json({
                code: "dtoInIsNotVal_id",
                message: "DTO is not valid",
                validationError: ajv.errors,
            });
            return;
        }

        const userId = req.auth?.userId;

        if (!userId) {
            res.status(401).json({
                code: "unauthorized",
                message: "User is not authorized.",
            });
            return;
        }

        const shoppingList = shoppingListDao.get(reqShoppingList._id);
        if (!shoppingList) {
            res.status(404).json({
                code: "shoppingListNotFound",
                message: `ShoppingList ${reqShoppingList._id} not found`,
            });
            return;
        }

        const isOwner = await userDao.ownerVal_idation(userId, reqShoppingList._id);
        if (!isOwner) {
            res.status(403).json({
                code: "accessDenied",
                message: `User does not have permission to delete ShoppingList ${reqShoppingList._id}`,
            });
            return;
        }

        shoppingListDao.remove(reqShoppingList._id);
        res.json({});
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = DeleteshoppingList;
