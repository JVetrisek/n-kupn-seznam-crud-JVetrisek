const shoppingListDao = require("../../dao/shoppingLIst-dao");

async function listByShoppingList(req, res){
    try{
        const reqParam = req.query?.shoppingListId ? req.query : req.body;

        const shoppingListValidation = shoppingListDao.get(reqParam.shoppingListId);
        if (!shoppingListValidation){
            res.status(404).json({
                code: "shoppinglistNotFound",
                message: `User ${req.ownerId} not found`,
              });
              return;
        }

        const shoppingListList = shoppingListDao.listByUser(reqParam.ownerId);
        res.json(shoppingListList);
    } catch (error){
        res.status(500).json({ message: error.message})
    }
}

module.exports = listByShoppingList;