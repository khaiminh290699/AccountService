const DB = require("./connect/db")
const Model = require("./model")
const ModelAccount = require("./model/account-model");
const ModelWeb = require("./model/web-model");

module.exports = {
  DB,
  Model,
  ModelAccount,
  ModelWeb
}