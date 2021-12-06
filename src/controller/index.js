const accountList = require("./account.list");
const accountUpsert = require("./account.upsert");
const accountToggle = require("./account.toggle");
const accountCreate = require("./account.create");
const accountUpdate = require("./account.update");

module.exports = {
  accountList,
  accountUpsert,
  accountToggle,
  accountCreate,
  accountUpdate
}