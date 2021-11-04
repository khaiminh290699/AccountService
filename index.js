const { Kafka, Rabbitmq } = require("./src/ultilities");
const { ModelAccount, Model, ModelWeb } = require("./src/db");
const { accountUpsert, accountList, accountToggle } = require("./src/controller");

const kafka = new Kafka();

kafka.consume("account.upsert", { groupId: "post.upsert" }, accountUpsert)

kafka.consume("account.list", { groupId: "account.list" }, accountList)

kafka.consume("account.toogle", { groupId: "account.toogle" }, accountToggle)

