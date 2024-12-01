const express = require('express');
const router = express.Router();

// Importování ABL funkcí pro shoppingListy
const GetShoppingListAbl = require("../abl/shoppingList/getAbl");
const ListShoppingListAbl = require("../abl/shoppingList/listAbl");
const CreateShoppingListAbl = require("../abl/shoppingList/createAbl");
const UpdateShoppingListAbl = require("../abl/shoppingList/updateAbl");
const DeleteShoppingListAbl = require("../abl/shoppingList/deleteAbl");
const AddMemberToShoppingListAbl = require("../abl/shoppingList/addMemberToShoppingListAbl");
const RemoveMemberFromShoppingListAbl = require("../abl/shoppingList/removeMemberFromShoppingListAbl");
const ListByUserShoppingListAbl = require("../abl/shoppingList/listByUserAbl");

// Route pro získání shoppingListu
router.get("/get", (req, res) => {
  GetShoppingListAbl(req, res);
});

// Route pro seznam shoppingListů
router.get("/list", (req, res) => {
  ListShoppingListAbl(req, res);
});

// Route pro vytvoření shoppingListu
router.post("/create", (req, res) => {
  CreateShoppingListAbl(req, res);
});

// Route pro aktualizaci shoppingListu
router.post("/update", (req, res) => {
  UpdateShoppingListAbl(req, res);
});

// Route pro smazání shoppingListu
router.post("/delete", (req, res) => {
  DeleteShoppingListAbl(req, res);
});

// Route pro přidání člena do shoppingListu
router.post("/addMember", (req, res) => {
  AddMemberToShoppingListAbl(req, res);
});

// Route pro odstranění člena ze shoppingListu
router.post("/removeMember", (req, res) => {
  RemoveMemberFromShoppingListAbl(req, res);
});

// Route pro seznam shoppingListů podle uživatele
router.get("/listByUser", (req, res) => {
  ListByUserShoppingListAbl(req, res);
});

module.exports = router;
