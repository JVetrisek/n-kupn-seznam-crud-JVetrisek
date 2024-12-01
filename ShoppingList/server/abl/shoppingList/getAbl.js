const Ajv = require('ajv')
const ajv = new Ajv();

const shoppingListDao = require("../../dao/shoppingLIst-dao");

const shoppingListSchema = {
    type: "object",
    properties: {
      _id: { type: "string" },
    },
    required: ["_id"],
    additionalProperties: false,
};

async function GethoppingList (req, res){
    try{
        const reqTask = req.query?._id ? req.query : req.body;

        const valid = ajv.validate(shoppingListSchema, reqTask)
        if (!valid){
            res.status(400).json({
                code: "dtoInIsNotValid",
                message: "dtoIn is not valid",
                validationError: ajv.error
            });
            return;
        }

        const shoppingList = shoppingListDao.get(reqTask._id);
        if (!shoppingList){
            res.status(404).json({
                code: "shoppingListNotFound",
                message: `shoppingList ${reqTask} not found`
              });
              return;
        }

        res.json(shoppingList)
    } catch(e){
        res.status(500).json({message: e.message});
    }
}

module.exports = GethoppingList;