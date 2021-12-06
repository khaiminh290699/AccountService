const { Model, ModelWeb, ModelAccount } = require("../db");

async function accountUpsert(data, db) {
  const { accounts } = data.params;
  const { id: user_id } = data.meta.user;
  if (!accounts) {
    return { status: 400, message: "SystemError: Missing params" }
  }

  const model = new Model(db);

  return await model.openTransaction(async (trx) => {

    const modelWeb = new ModelWeb(db, trx);
    const modelAccount = new ModelAccount(db, trx);
  
    await modelAccount.query().update({ disable: true }).where({ user_id }).whereNotIn("id", accounts.reduce((list, account) => { 
      if (account.id) {
        list.push(account.id);
      }
      return list;
    }, []))
  
    if (!accounts.length) {
      return { status: 200, data: { accounts: [] } }
    }
    
    const webs = await modelWeb.query().whereIn("web_key", accounts.map((account) => account.web_key));

    const listUpdate = accounts.filter((account) => account.id);
    const listInsert = accounts.filter((account) => !account.id);

    const result = [];
    if (listUpdate.length) {
      const list = await modelAccount.query().insert(
        listUpdate.map((account) => {
          const web = webs.filter((web) => web.web_key === account.web_key)[0];
          return {
            id: account.id,
            user_id,
            username: account.username,
            password: account.password,
            web_id: web.id
          }
        })
      ).onConflict(["id"]).merge().returning(["*"]);
      result.push(...list);
    }

    let listInsertButDisable = [];
    if (listInsert.length) {
      const list = await modelAccount.query().insert(
        listInsert.map((account) => {
          const web = webs.filter((web) => web.web_key === account.web_key)[0];
          return {
            user_id,
            username: account.username,
            password: account.password,
            web_id: web.id
          }
        })
      ).onConflict(["user_id", "web_id", "username"]).ignore().returning(["*"]);
      listInsertButDisable = list.filter((item) => item.disbale);
      result.push(...list.filter((item) => !item.disbale));
    }


    return { status: 200, data: { accounts: result, listInsertButDisable } }
  })
}

module.exports = accountUpsert;