const Ajv = require('ajv');
const ajv = new Ajv();

const shoppingListDao = require("../../dao/shoppingLIst-dao");
const userDao = require("../../dao/user-dao.js"); // Pro použití ownerVal_idation

const shoppingListSchema = {
    type: "object",
    properties: {
        __id: { type: "string" },
    },
    required: ["__id"],
    additionalProperties: false,
};

async function DeleteshoppingList(req, res) {
    try {
        const reqShoppingList = req.query?._id ? req.query : req.body;

        // Val_idace DTO (data transfer object)
        const val_id = ajv.val_idate(shoppingListSchema, reqShoppingList);
        if (!val_id) {
            res.status(400).json({
                code: "dtoInIsNotVal_id",
                message: "DTO is not val_id",
                val_idationError: ajv.errors,
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
        const isOwner = await userDao.ownerVal_idation(userId, reqShoppingList._id);
        if (!isOwner) {
            res.status(403).json({
                code: "accessDenied",
                message: `User does not have permission to delete ShoppingList ${reqShoppingList._id}`,
            });
            return;
        }

        // Odstranění nákupního seznamu
        shoppingListDao.remove(reqShoppingList._id);
        res.json({}); // Vrátíme prázdnou odpověď jako potvrzení smazání
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = DeleteshoppingList;
