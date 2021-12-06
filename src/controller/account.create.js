const { ModelAccount } = require("../db");

async function accountCreate(data, db) {
  const { username, password, web_id } = data.params;
  const { id: user_id } = data.meta.user;
  if (!username || !password) {
    return { status: 400, message: "SystemError: Missing params" }
  }

  const modelAccount = new ModelAccount(db);
  const account = await modelAccount.create(username, password, web_id, user_id);
  return { status: 200, data: { account } };
}

module.exports = accountCreate;