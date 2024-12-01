const itemDao = require("../../dao/item-dao.js");
const userDao = require("../../dao/user-dao.js"); // Pro použití memberValidation

async function ListAbl(req, res) {
    try {
        const userId = req.auth?.userId; // Předpokládáme, že uživatelské ID je v `req.auth`

        if (!userId) {
            res.status(401).json({
                code: "unauthorized",
                message: "User is not authorized.",
            });
            return;
        }

        const itemList = await itemDao.list(); // Získání seznamu položek

        if (!itemList || itemList.length === 0) {
            res.status(404).json({
                code: "noItemsFound",
                message: "No items found.",
            });
            return;
        }

        // Ověření, zda uživatel má přístup k položkám
        const itemsWithAccess = [];
        for (const item of itemList) {
            const hasAccess = await userDao.memberValidation(userId, item.shoppingListId);
            if (hasAccess) {
                itemsWithAccess.push(item);
            }
        }

        if (itemsWithAccess.length === 0) {
            res.status(403).json({
                code: "accessDenied",
                message: "User does not have access to any items.",
            });
            return;
        }

        // Vrácení položek, ke kterým má uživatel přístup
        res.json(itemsWithAccess);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = ListAbl;
