const { ModelAccount } = require("../db");

async function accountToggle(data, db) {
  const { account_id } = data.params;
  const { id: user_id, isAdmin } = data.meta.user;
  const modelAccount = new ModelAccount(db);

  return await modelAccount.toggleDisableAccount(account_id, user_id, isAdmin);
}

module.exports = accountToggle;