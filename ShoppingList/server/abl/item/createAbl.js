const Ajv = require('ajv');
const ajv = new Ajv();
const itemDao = require("../../dao/item-dao.js");
const shoppingListDao = require("../../dao/shoppingLIst-dao.js");
const userDao = require("../../dao/user-dao.js");

const itemSchema = {
    type: "object",
    properties: {
        name: { type: "string" },
        description: { type: "string" },
        price: { type: Number },
        shoppingListId: { type: "string" },
    },
    required: ["name", "shoppingListId"],
    additionalProperties: false,
};

async function CreateItem(req, res) {
    try {
        const reqItem = req.body;

        // Validace DTO (data transfer object)
        const valid = ajv.validate(itemSchema, reqItem);
        if (!valid) {
            res.status(400).json({
                code: "dtoInIsNotValid",
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

        // Ověření, že nákupní seznam existuje
        const shoppingList = shoppingListDao.get(reqItem.shoppingListId);
        if (!shoppingList) {
            res.status(404).json({
                code: "shoppingListNotFound",
                message: `ShoppingList ${reqItem.shoppingListId} not found`,
            });
            return;
        }

        // Ověření, zda má uživatel přístup k danému nákupnímu seznamu
        const hasAccess = await userDao.memberValidation(userId, reqItem.shoppingListId);
        if (!hasAccess) {
            res.status(403).json({
                code: "accessDenied",
                message: `User does not have access to ShoppingList ${reqItem.shoppingListId}`,
            });
            return;
        }

        // Vytvoření nové položky
        reqItem._id = crypto.randomBytes(16).toString("hex"); // Generování ID položky
        const createdItem = itemDao.create(reqItem); // Vytvoření položky v databázi/souboru

        res.status(201).json(createdItem); // Vracení vytvořené položky jako odpověď
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = CreateItem;
