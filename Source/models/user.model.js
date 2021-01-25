const db = require("../utils/db");
const config = require("../config/default.json");

const TBL_users = "users";
const TBL_typeOfUser = "typeofuser";
const TBL_refreshToken = "refreshToken";
const TBL_userPremium = "user_premium";
module.exports = {
  AuthorWithIdArticle: async function (idArticle) {
    const result = await db.load(`SELECT US.IDUser, US.Avatar, US.FullName, US.Email
                        FROM ${TBL_users} US LEFT JOIN article art ON art.Writter = US.IDUser
                        WHERE art.IDArticle = ${idArticle}`);
    return result[0];
  },
  UserWithID: async function (idUser) {
    const result = await db.load(`SELECT IDUser, FullName, Avatar, Phone, Email, Address,  DATE_FORMAT(DOB, "%d/%m/%Y") as DOB, NickName,UserName 
        FROM ${TBL_users} WHERE IDUser = ${idUser} AND Status = 1`);
    return result[0];
  },
  UserWithEmail: async function (email) {
    const result = await db.load(`SELECT IDUser, FullName, Avatar, Phone, Email, Address,  DATE_FORMAT(DOB, "%d/%m/%Y") as DOB, NickName,UserName 
        FROM ${TBL_users} WHERE Email = '${email}' AND Status = 1`);
    return result[0];
  },
  makeTokenWithUser: function (entity) {
    return db.add(TBL_refreshToken, entity);
  },
  existsToken: async function (token) {
    const result = await db.load(
      `SELECT IDUser FROM refreshToken WHERE token like '${token}'`
    );
    return result[0];
  },
  singleByUserName: async function (username) {
    const rows = await db.load(
      `SELECT US.IDUser, US.UserName, US.Password, US.TypeOfUser, TofUS.TypeName, USp.IDUser AS Premium ,USp.DateEnd 
      FROM ${TBL_users} US JOIN ${TBL_typeOfUser} TofUS ON US.TypeOfUser = TofUS.IDType LEFT JOIN user_premium USp ON USp.IDUser = US.IDUser
      WHERE US.UserName = '${username}'`
    );
    if (rows.length === 0) return null;

    return rows[0];
  },
  singleByID: async function (id) {
    const rows = await db.load(
      `SELECT IDUser,FullName FROM ${TBL_users} WHERE IDUser = '${id}'`
    );
    if (rows.length === 0) return null;

    return rows[0];
  },
  singleByIDFacebook: async function (idFacebook) {
    const rows = await db.load(
      `SELECT IDUser, UserName, Password, TypeOfUser FROM ${TBL_users} WHERE idFacebook = '${idFacebook}'`
    );
    if (rows.length === 0) return null;

    return rows[0];
  },

  infoUserByID: async function (id) {
    const rows = await db.load(
      `SELECT UserName, FullName, Phone, Email, Address, DATE_FORMAT(DOB, "%d/%m/%Y") as DOB, NickName, TypeOfUser FROM ${TBL_users} WHERE IDUser = ${id}`
    );
    if (rows.length === 0) return null;

    return rows[0];
  },

  updateInfoUser: async function (entity) {
    const condition = {
      IDUser: entity.IDUser,
    };
    delete entity.IDUser;
    const rows = await db.patch(TBL_users, entity, condition);

    return rows;
  },

  updatePasswordUser: async function (entity) {
    const condition = {
      IDUser: entity.IDUser,
    };
    delete entity.IDUser;
    const rows = await db.patch(TBL_users, entity, condition);

    return rows;
  },

  addFacebookUser: async function (entity) {
    const rows = await db.add(TBL_users, entity);

    return rows;
  },
  addSubscriber: async function (entity) {
    const rows = await db.add(TBL_users, entity);

    return rows;
  },
  SelectAll: function () {
    return db.load(
      `SELECT u.IDUser, u.FullName, u.Phone, u.Email, u.Address, u.DOB, u.NickName, tou.TypeName, s.StatusName,up.DateEnd FROM ${TBL_users} u JOIN typeofuser tou ON u.TypeOfUser = tou.IDType JOIN status s ON u.status = s.IDstatus LEFT JOIN user_premium up ON u.IDUser = up.IDUser `
    );
  },
  AddUser: function (entity) {
    return db.add(TBL_users, entity);
  },
  SelectTypeOfUser: function () {
    return db.load(`SELECT IDType,TypeName FROM typeofuser`);
  },

  updateUser: function (entity, condition) {
    condition = {
      IDUser: condition,
    };
    return db.patch(TBL_users, entity, condition);
  },
  AddNewUserPremium: function (entity) {
    return db.add(TBL_userPremium, entity);
  },
  UpdateUserPremium: function (entity) {
    var condition = { IDUser: entity.IDUser };
    delete entity.IDUser;
    return db.patch(TBL_userPremium, entity, condition);
  },

  addDurationPremium: function (IDUser) {
    return db.UpdateByQuery(`UPDATE ${TBL_userPremium} set DateEnd =  ADDTIME(DateEnd, "00:${config.premium.timeout}:00") WHERE IDUser = ${IDUser}`);
  },

  SingleUserPremium: function (idUser) {
    return db.load(`SELECT * FROM ${TBL_userPremium} WHERE IDUser = ${idUser}`);
  },
  SingleUser:function(id)
  {
    return db.load(`SELECT * FROM ${TBL_users} WHERE IDUser = ${id}`)
  },
  CheckPremiumByID: async function(idUser){
    const result = await db.load(`SELECT * FROM ${TBL_userPremium} WHERE IDUser = ${idUser} AND Now() < DateEnd`);
    return result.length != 0;
  }
};
