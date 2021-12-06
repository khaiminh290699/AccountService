const { ModelAccount } = require("../db");

async function accountUpdate(data, db) {
  const { id, username, password } = data.params;
  if (!id || !username || !password) {
    return { status: 400, message: "SystemError: Missing params" }
  }

  const modelAccount = new ModelAccount(db);
  const account = await modelAccount.update(id, username, password);
  return { status: 200, data: { account } };
}

module.exports = accountUpdate;