const shoppingListDao = require("../../dao/shoppingLIst-dao");
const itemDao = require("../../dao/item-dao.js");
const userDao = require("../../dao/user-dao.js"); // Pro použití memberValidation

async function listByShoppingList(req, res) {
    try {
        const reqParam = req.query?.shoppingListId ? req.query : req.body;
        const userId = req.auth?.userId; // Předpokládáme, že uživatelské ID je v `req.auth`

        if (!userId) {
            res.status(401).json({
                code: "unauthorized",
                message: "User is not authorized.",
            });
            return;
        }

        const shoppingList = shoppingListDao.get(reqParam.shoppingListId);
        if (!shoppingList) {
            res.status(404).json({
                code: "shoppingListNotFound",
                message: `ShoppingList ${reqParam.shoppingListId} not found`,
            });
            return;
        }

        // Ověření, zda má uživatel přístup k tomuto nákupnímu seznamu
        const hasAccess = await userDao.memberValidation(userId, reqParam.shoppingListId);
        if (!hasAccess) {
            res.status(403).json({
                code: "accessDenied",
                message: `User does not have access to ShoppingList ${reqParam.shoppingListId}`,
            });
            return;
        }

        // Pokud má uživatel přístup, vrátíme položky daného seznamu
        const itemList = itemDao.listByShoppingList(reqParam.shoppingListId);
        res.json(itemList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = listByShoppingList;
