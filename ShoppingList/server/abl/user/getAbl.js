const Ajv = require('ajv')
const ajv = new Ajv();

const itemDao = require("../../dao/item-dao.js");

const itemSchema = {
    type: "object",
    properties: {
      _id: { type: "string" },
    },
    required: ["_id"],
    additionalProperties: false,
};

async function Getitem (req, res){
    try{
        const reqTask = req.query?._id ? req.query : req.body;

        const valid = ajv.validate(itemSchema, reqTask)
        if (!valid){
            res.status(400).json({
                code: "dtoInIsNotValid",
                message: "dtoIn is not valid",
                validationError: ajv.error
            });
            return;
        }

        const item = itemDao.get(reqTask._id);
        if (!item){
            res.status(404).json({
                code: "itemNotFound",
                message: `item ${reqTask} not found`
              });
              return;
        }

        res.json(item)
    } catch(e){
        res.status(500).json({message: e.message});
    }
}

module.exports = Getitem;