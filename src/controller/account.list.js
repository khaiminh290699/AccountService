const { ModelAccount } = require("../db");

async function accountList(data, db) {
  const { wheres = [], order, pageSize, pageIndex, mode } = data.params;
  const { id: user_id, isAdmin } = data.meta.user;

  if (!isAdmin && mode === "admin") {
    return { status: 403, message: "Not permission" }
  }

  const modelAccount = new ModelAccount(db);
  const query = modelAccount.query()
    .join("users", "users.id", "accounts.user_id")
    .join("webs", "webs.id", "accounts.web_id").select(
      modelAccount.DB.raw(`
        COUNT(*) OVER(),
        accounts.*,
        webs.web_url,
        webs.web_key,
        webs.web_name,
        users.id AS user_id,
        users.username AS user_username
      `)
    );

  if (mode != "admin") {
    wheres.push({ user_id: { "$eq": user_id } });
  }

  const accounts = await modelAccount.queryByCondition(query, wheres, pageIndex, pageSize, order);
  const total = accounts[0] ? +accounts[0].count : 0;
  return { status: 200, data: { accounts, total } }
}

module.exports = accountList;