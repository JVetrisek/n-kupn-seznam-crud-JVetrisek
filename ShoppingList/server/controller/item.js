const express = require('express');
const router = express.Router();

// Importování ABL funkcí pro itemy
const GetItemAbl = require("../abl/item/getAbl");
const ListItemAbl = require("../abl/item/listAbl");
const CreateItemAbl = require("../abl/item/createAbl");
const UpdateItemAbl = require("../abl/item/updateAbl");
const DeleteItemAbl = require("../abl/item/deleteAbl");
const ListByShoppingListAbl = require("../abl/item/listByShoppingListAbl");

// Route pro získání itemu
router.get("/get", (req, res) => {
  GetItemAbl(req, res);
});

// Route pro seznam itemů
router.get("/list", (req, res) => {
  ListItemAbl(req, res);
});

// Route pro vytvoření itemu
router.post("/create", (req, res) => {
  CreateItemAbl(req, res);
});

// Route pro aktualizaci itemu
router.post("/update", (req, res) => {
  UpdateItemAbl(req, res);
});

// Route pro smazání itemu
router.post("/delete", (req, res) => {
  DeleteItemAbl(req, res);
});

// Route pro získání itemů podle shopping listu
router.get("/listByShoppingList", (req, res) => {
  ListByShoppingListAbl(req, res);
});

module.exports = router;
