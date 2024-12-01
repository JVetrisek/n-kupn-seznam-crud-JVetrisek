const Ajv = require('ajv');
const ajv = new Ajv();

const shoppingListDao = require("../../dao/shoppingLIst-dao");
const userDao = require("../../dao/user-dao.js"); // Pro použití ownerValidation

const shoppingListSchema = {
    type: "object",
    properties: {
        _id: { type: "string" },
        name: { type: "string" },
        description: { type: "string" },
        membersIds: { type: "array", items: { type: "string" } }, // Předpokládáme, že membersIds je pole ID členů
        archive: { type: "boolean" }
    },
    required: ["_id"], // ID je povinné
    additionalProperties: true, // Další vlastnosti mohou být volitelné
};

async function UpdateShoppingList(req, res) {
    try {
        const reqShoppingList = req.query?._id ? req.query : req.body;

        // Validace DTO (data transfer object)
        const valid = ajv.validate(shoppingListSchema, reqShoppingList);
        if (!valid) {
            res.status(400).json({
                code: "dtoInIsNotValid",
                message: "DTO is not valid",
                validationError: ajv.errors,
            });
            return;
        }

        const userId = req.auth?.userId; // Předpokládáme, že uživatelské ID je v `req.auth`

        if (!userId) {
            res.status(401).json({
                code: "unauthorized",
                message: "User is not authorized.",
            });
            return;
        }

        // Ověření, zda nákupní seznam existuje
        const shoppingList = shoppingListDao.get(reqShoppingList._id);
        if (!shoppingList) {
            res.status(404).json({
                code: "shoppingListNotFound",
                message: `ShoppingList ${reqShoppingList._id} not found`,
            });
            return;
        }

        // Ověření, zda je uživatel vlastníkem nákupního seznamu
        const isOwner = await userDao.ownerValidation(userId, reqShoppingList._id);
        if (!isOwner) {
            res.status(403).json({
                code: "accessDenied",
                message: `User does not have permission to update ShoppingList ${reqShoppingList._id}`,
            });
            return;
        }

        // Aktualizace nákupního seznamu
        const updatedShoppingList = { ...shoppingList, ...reqShoppingList };
        shoppingListDao.update(updatedShoppingList);

        res.json(updatedShoppingList); // Vrátíme aktualizovaný seznam
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = UpdateShoppingList;
