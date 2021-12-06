const Model = require("./index");

class ModelAccount extends Model {
  tableName = "accounts";

  list = async (mode, user_id, wheres, pageIndex, pageSize, order) => {
    const query = this.query()
    .join("users", "users.id", "accounts.user_id")
    .join("webs", "webs.id", "accounts.web_id").select(
      this.DB.raw(`
        COUNT(*) OVER(),
        accounts.*,
        webs.web_url,
        webs.web_key,
        webs.web_name,
        users.id AS user_id,
        users.username AS user_username
      `)
    )

    if (mode != "admin") {
      wheres.push({ user_id: { "$eq": user_id } });

      query .whereRaw(`
        accounts.disable = false
      `);
    }

    return await this.queryByCondition(query, wheres, pageIndex, pageSize, order);
  }

  create = async (username, password, web_id, user_id) => {
    try {
      const account = await this.findOne({ username, user_id, web_id });
      if (account && account.disable) {
        account.disable = false;
        throw new Error("Your account already exist but is disable, contact admin to recover");
      }
      return await this.insertOne({ username, password, user_id, web_id });
    } catch (err) {
      if (err.message.includes("accounts_user_id_web_id_username_unique")) {
        throw new Error("Your account username already exist in your list account by web");
      }
      throw err;
    }
  }

  update = async (id, username, password) => {
    try {
      const account = await this.findOne({ id });
      if (!account) {
        throw new Error("Account not found");
      }
      return await this.updateOne({ ...account, username, password });
    } catch (err) {
      if (err.message.includes("accounts_user_id_web_id_username_unique")) {
        throw new Error("Your account username already exist in your list account by web");
      }
      throw err;
    }
  }

  toggleDisableAccount = async (account_id, user_id, isAdmin) => {
    let account = await this.findOne({ id: account_id });
    if (!account) {
      return { status: 404, message: "Account not found" }
    }
    if (account.user_id != user_id && !isAdmin) {
      return { status: 403, message: "Can not toggle another user's account" }
    }
    if (account.disable && !isAdmin) {
      return { status: 400, message: "Only admin can recover account" }
    }
    account.disable = !account.disable;
    account = await this.updateOne(account);
    return { status: 200, data: { account } }
  }
}

module.exports = ModelAccount;