const db = require("../utils/db");

const TBL_category = "cate";
const TBL_sub_category = "sub_categories";
module.exports = {
  Load: function () {
    return db.load(
      `SELECT a.IDArticle id,t.TagName FROM article a JOIN article_tag art ON a.IDArticle = art.IDArticle JOIN tags t ON art.IDTag = t.IDTag WHERE a.Status = 6`
    );
  },
  allCate: function () {
    return db.load(`SELECT IDCategory, CategoryName FROM cate WHERE status = 1`);
  },
  allSubCate: function () {
    return db.load(
      `SELECT IDSubCategory, IDCategory, SubCategoryName FROM sub_categories WHERE status = 1`
    );
  },
  LoadCate: function () {
    return db.load(
      `SELECT IDCategory, CategoryName FROM ${TBL_category} WHERE status = 1`
    );
  },
  LoadSubCate: function () {
    return db.load(
      `SELECT sc.IDSubCategory,sc.IDCategory, sc.SubCategoryName,c.CategoryName FROM ${TBL_sub_category} sc JOIN ${TBL_category} c ON sc.IDCategory = c.IDCategory WHERE sc.Status = 1`
    );
  },
  updateCate: function (entity, condition) {
    condition = {
      IDCategory: condition,
    };
    return db.patch(TBL_category, entity, condition);
  },
  updateSubCate: function (entity, condition) {
    condition = {
      IDSubCategory: condition,
    };
    return db.patch(TBL_sub_category, entity, condition);
  },
  InsertCate: function (entity) {
    return db.add(TBL_category, entity);
  },
  InsertSubCate: function (entity) {
    return db.add(TBL_sub_category, entity);
  },
  SingleCate: function (id) {
    return db.load(
      `SELECT IDCategory, CategoryName FROM ${TBL_category} WHERE status = 1 and IDCategory=${id}`
    );
  },
  SingleSubCate: function (id) {
    return db.load(
      `SELECT sc.IDSubCategory,sc.IDCategory, sc.SubCategoryName,c.CategoryName FROM ${TBL_sub_category} sc JOIN ${TBL_category} c ON sc.IDCategory = c.IDCategory WHERE sc.Status = 1 and sc.IDSubCategory=${id}`
    );
  },
  GetNameByID:async function(id){  
      const result = await db.load(`SELECT CategoryName FROM ${TBL_category} WHERE IDCategory = ${id}`);
      return result[0].CategoryName;
  },
  GetNameByIDSub: async function(id){  
    const result = await db.load(`SELECT SubCategoryName FROM ${TBL_sub_category} WHERE IDSubCategory = ${id}`);
    return result[0].SubCategoryName;
  },

  // loadSubCateByIDcate: function (idCate) {
  //   return db.load(
  //     `SELECT IDSubCategory, IDCategory, SubCategoryName FROM sub_categories WHERE status = 1 and IDCategory = ${idCate}`
  //   );
};
