const express = require('express');
const router = express.Router();

// Importování ABL funkcí pro uživatele
const GetUserAbl = require("../abl/user/getAbl");
const ListUserAbl = require("../abl/user/listAbl");
const CreateUserAbl = require("../abl/user/createAbl");
const UpdateUserAbl = require("../abl/user/updateAbl");
const DeleteUserAbl = require("../abl/user/deleteAbl");

// Route pro získání uživatele
router.get("/get", (req, res) => {
  GetUserAbl(req, res);
});

// Route pro seznam uživatelů
router.get("/list", (req, res) => {
  ListUserAbl(req, res);
});

// Route pro vytvoření uživatele
router.post("/create", (req, res) => {
  CreateUserAbl(req, res);
});

// Route pro aktualizaci uživatele
router.post("/update", (req, res) => {
  UpdateUserAbl(req, res);
});

// Route pro smazání uživatele
router.post("/delete", (req, res) => {
  DeleteUserAbl(req, res);
});

module.exports = router;
