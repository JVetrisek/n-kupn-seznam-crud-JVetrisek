const Ajv = require('ajv');
const ajv = new Ajv();

const shoppingListDao = require("../../dao/shoppingLIst-dao");
const userDao = require("../../dao/user-dao.js"); // Pro použití ownerValidation

const addMemberSchema = {
    type: "object",
    properties: {
        shoppingListId: { type: "string" },
        memberId: { type: "string" },
    },
    required: ["shoppingListId", "memberId"],
    additionalProperties: false,
};

async function AddMemberToShoppingList(req, res) {
    try {
        const reqBody = req.query?.shoppingListId && req.query?.memberId ? req.query : req.body;

        // Validace DTO (data transfer object)
        const valid = ajv.validate(addMemberSchema, reqBody);
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
        const shoppingList = shoppingListDao.get(reqBody.shoppingListId);
        if (!shoppingList) {
            res.status(404).json({
                code: "shoppingListNotFound",
                message: `ShoppingList ${reqBody.shoppingListId} not found`,
            });
            return;
        }

        // Ověření, zda je uživatel vlastníkem nákupního seznamu
        const isOwner = await userDao.ownerValidation(userId, reqBody.shoppingListId);
        if (!isOwner) {
            res.status(403).json({
                code: "accessDenied",
                message: `User does not have permission to add member to ShoppingList ${reqBody.shoppingListId}`,
            });
            return;
        }

        // Ověření, zda člen již není v seznamu
        if (shoppingList.membersIds.includes(reqBody.memberId)) {
            res.status(400).json({
                code: "memberAlreadyExists",
                message: `Member with ID ${reqBody.memberId} is already in the shopping list.`,
            });
            return;
        }

        // Přidání člena do seznamu
        shoppingList.membersIds.push(reqBody.memberId);
        shoppingListDao.update(shoppingList);

        res.json({ message: `Member with ID ${reqBody.memberId} added to shopping list ${reqBody.shoppingListId}.` });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = AddMemberToShoppingList;
