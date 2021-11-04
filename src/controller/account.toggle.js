const { ModelAccount } = require("../db");

async function accountToggle(data, db) {
  const { account_id } = data.params;
  const modelAccount = new ModelAccount(db);
  let account = await modelAccount.findOne({ id: account_id });
  if (!account) {
    return { status: 404, message: "Account not found" }
  }
  account.disable = !account.disable;
  account = await modelAccount.updateOne(account);
  return { status: 200, data: { account } }
}

module.exports = accountToggle;