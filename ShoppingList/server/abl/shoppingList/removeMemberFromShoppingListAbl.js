const Ajv = require('ajv');
const ajv = new Ajv();

const shoppingListDao = require("../../dao/shoppingLIst-dao");
const userDao = require("../../dao/user-dao.js"); // Pro použití ownerValidation

const removeMemberSchema = {
    type: "object",
    properties: {
        shoppingListId: { type: "string" },
        memberId: { type: "string" },
    },
    required: ["shoppingListId", "memberId"],
    additionalProperties: false,
};

async function RemoveMemberFromShoppingList(req, res) {
    try {
        const reqBody = req.query?.shoppingListId && req.query?.memberId ? req.query : req.body;

        // Validace DTO (data transfer object)
        const valid = ajv.validate(removeMemberSchema, reqBody);
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
                message: `User does not have permission to remove member from ShoppingList ${reqBody.shoppingListId}`,
            });
            return;
        }

        // Ověření, zda člen existuje v seznamu
        const memberIndex = shoppingList.membersIds.indexOf(reqBody.memberId);
        if (memberIndex === -1) {
            res.status(400).json({
                code: "memberNotFound",
                message: `Member with ID ${reqBody.memberId} not found in the shopping list.`,
            });
            return;
        }

        // Odstranění člena z seznamu
        shoppingList.membersIds.splice(memberIndex, 1);
        shoppingListDao.update(shoppingList);

        res.json({ message: `Member with ID ${reqBody.memberId} removed from shopping list ${reqBody.shoppingListId}.` });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = RemoveMemberFromShoppingList;
