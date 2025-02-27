const db = require("../utils/db");
const { text } = require("express");

const TBL_article = "article";
module.exports = {
  allArticle: function () {
    return db.load(`SELECT art.IsPremium ,art.IDArticle ,art.Title, art.Avatar,art.Views,art.Ranks, art.TimePublish, art.IDCate, 
    c.CategoryName, art.IDSubCategory, subcate.SubCategoryName, count(CM.comment) as numofCM
    FROM ${TBL_article} art LEFT JOIN cate c on art.IDCate = c.IDCategory LEFT JOIN comment CM ON CM.IDArticle = art.IDArticle 
    LEFT JOIN sub_categories subcate ON subcate.IDCategory = art.IDCate AND subcate.IDSubCategory = art.IDSubCategory 
    WHERE art.Status = 4 AND art.TimePublish <= now()
    GROUP BY art.IDArticle, art.Title, art.Avatar,art.Views,art.Ranks, 
    art.TimePublish,art.IDCate, c.CategoryName, art.IDSubCategory, subcate.SubCategoryName 
    ORDER BY art.ranks`);
  },
  Top3Trend: function () {
    return db.load(`SELECT art.IsPremium ,art.IDArticle ,art.Title, art.Avatar,art.Views,art.Ranks, art.TimePublish, art.IDCate, 
    c.CategoryName, art.IDSubCategory, subcate.SubCategoryName, count(CM.comment) as numofCM
    FROM ${TBL_article} art LEFT JOIN cate c ON art.IDCate = c.IDCategory LEFT JOIN comment CM ON CM.IDArticle = art.IDArticle 
    LEFT JOIN sub_categories subcate ON subcate.IDCategory = art.IDCate AND subcate.IDSubCategory = art.IDSubCategory 
    WHERE art.Status = 4 AND art.TimePublish <= now()
    GROUP BY art.IDArticle, art.Title, art.Avatar,art.Views,art.Ranks, 
    art.TimePublish,art.IDCate, c.CategoryName, art.IDSubCategory, subcate.SubCategoryName 
    ORDER BY art.views DESC LIMIT 3`);
  },
  ListPublished: function () {
    return db.load(
      `SELECT a.IDArticle, a.Title,a.IDCate, a.Abstract,a.Writter, a.Views,a.Ranks,a.TimePublish,a.Status,u.NickName,s.StatusName FROM ${TBL_article} a LEFT JOIN users u ON a.Writter = u.IDUser JOIN status s ON a.Status = s.IDStatus WHERE a.Status = 4 and a.TimePublish < now()`
    );
  },
  ListApproved: function () {
    return db.load(
      `SELECT a.IDArticle, a.Title,a.IDCate, a.Abstract,a.Writter,a.TimePublish,a.Status,u.NickName FROM ${TBL_article} a LEFT JOIN users u ON a.Writter = u.IDUser JOIN status s ON a.Status = s.IDStatus WHERE a.Status = 4 and a.TimePublish > now()`
    );
  },
  ListDraft: function () {
    return db.load(
      `SELECT a.IDArticle, a.Title, a.Abstract,a.IDCate,a.Writter,u.NickName,s.StatusName FROM ${TBL_article} a LEFT JOIN users u ON a.Writter = u.IDUser JOIN status s ON a.Status = s.IDStatus WHERE a.Status = 6`
    );
  },
  ListDenied: function () {
    return db.load(
      `SELECT  a.IDArticle,a.IDCate, a.Title, a.Abstract,a.Writter,u.NickName,s.StatusName, c.reason, c.date, c.FullName
      FROM article a LEFT JOIN users u ON a.Writter = u.IDUser JOIN status s ON a.Status = s.IDStatus 
      JOIN (SELECT cen.IDArticle, cen.reason, cen.date, us.FullName FROM censorship cen JOIN users us ON cen.IDUser = us.IDUser) as c 
      ON a.IDArticle = c.IDArticle WHERE a.Status = 5`
    );
  },
  ListDraftCategory: function () {
    return db.load(
      `SELECT distinct a.IDArticle id,c.CategoryName FROM ${TBL_article} a JOIN sub_categories sc ON sc.IDSubCategory = a.IDSubCategory  JOIN cate c ON sc.IDCategory = c.IDCategory WHERE a.Status = 6`
    );
  },
  ListDraftTag: function () {
    return db.load(`SELECT a.IDArticle id,t.TagName FROM ${TBL_article} a JOIN article_tag art ON a.IDArticle = art.IDArticle JOIN tags t ON art.IDTag = t.IDTag WHERE a.Status = 6
    `);
  },
  single: function (id) {
    return db.load(`SELECT a.IDArticle,a.Title,a.Content,a.Avatar,a.BigAvatar,a.Abstract,u.NickName,a.Views,a.Ranks,a.TimePublish, a.IDCate, a.IDSubCategory
    FROM ${TBL_article} a LEFT JOIN users u ON a.Writter = u.IDUser JOIN status s ON a.Status = s.IDStatus WHERE a.IDArticle = ${id}`);
  },
  IDSingleLast: function () {
    return db.load(
      `SELECT a.IDArticle FROM ${TBL_article} a ORDER BY a.IDArticle DESC LIMIT 1`
    );
  },
  singleWithTag: function (id) {
    return db.load(`SELECT a.IDArticle id,t.TagName FROM ${TBL_article} a JOIN article_tag art ON a.IDArticle = art.IDArticle JOIN tags t ON art.IDTag = t.IDTag WHERE a.IDArticle = ${id}
    `);
  },
  singleWithCategory: function (id) {
    return db.load(
      `SELECT distinct a.IDArticle id,c.CategoryName FROM ${TBL_article} a JOIN cate c ON a.IDCate = c.IDCategory WHERE  a.IDArticle = ${id}`
    );
  },
  singleWithSubCategory: function (id) {
    return db.load(`SELECT a.IDArticle id,sc.SubCategoryName FROM ${TBL_article} a JOIN sub_categories sc ON a.IDCate = sc.IDCategory and a.IDSubCategory = sc.IDSubCategory WHERE a.IDArticle =  ${id}
    `);
  },

  newTime: function (current, limit) {
    return db.load(`SELECT art.IsPremium ,art.IDArticle, art.Title, art.Avatar, art.Views,art.Ranks, art.Abstract,art.TimePublish, 
    art.IDCate, c.CategoryName, us.FullName, art.IDSubCategory, subcate.SubCategoryName, count(CM.comment) as numofCM 
    FROM ${TBL_article} art LEFT JOIN cate c ON art.IDCate = c.IDCategory LEFT JOIN comment CM ON CM.IDArticle = art.IDArticle 
    LEFT JOIN users us ON art.Writter = us.IDUser LEFT JOIN sub_categories subcate ON subcate.IDCategory = art.IDCate 
    AND subcate.IDSubCategory = art.IDSubCategory 
    WHERE art.Status = 4 AND art.TimePublish <= now()
    GROUP BY art.IDArticle, art.Title, art.Avatar,art.Views,art.Ranks, art.TimePublish, art.IDCate, 
    c.CategoryName, us.FullName, art.IDSubCategory, subcate.SubCategoryName 
    ORDER BY art.TimePublish DESC LIMIT ${limit} OFFSET ${current}`);
  },
  Top10Views: function () {
    return db.load(`SELECT art.IsPremium ,art.IDArticle, art.Title, art.Avatar, art.Views,art.Ranks, art.Abstract,art.TimePublish, 
    art.IDCate, c.CategoryName, us.FullName, art.IDSubCategory, subcate.SubCategoryName, count(CM.comment) as numofCM 
    FROM ${TBL_article} art LEFT JOIN cate c ON art.IDCate = c.IDCategory LEFT JOIN comment CM ON CM.IDArticle = art.IDArticle 
    LEFT JOIN users us ON art.Writter = us.IDUser LEFT JOIN sub_categories subcate ON subcate.IDCategory = art.IDCate 
    AND subcate.IDSubCategory = art.IDSubCategory 
    WHERE art.Status = 4 AND art.TimePublish <= now()
    GROUP BY art.IDArticle, art.Title, art.Avatar,art.Views,art.Ranks, art.TimePublish, art.IDCate, 
    c.CategoryName, us.FullName, art.IDSubCategory, subcate.SubCategoryName 
    ORDER BY art.Views DESC LIMIT 10`);
  },
  Top3Views: function () {
    return db.load(`SELECT art.IsPremium ,art.IDArticle, art.Title, art.Avatar, art.Views,art.Ranks, art.Abstract,art.TimePublish, 
    art.IDCate, c.CategoryName, us.FullName, art.IDSubCategory, subcate.SubCategoryName, count(CM.comment) as numofCM 
    FROM ${TBL_article} art LEFT JOIN cate c ON art.IDCate = c.IDCategory LEFT JOIN comment CM ON CM.IDArticle = art.IDArticle 
    LEFT JOIN users us ON art.Writter = us.IDUser LEFT JOIN sub_categories subcate ON subcate.IDCategory = art.IDCate 
    AND subcate.IDSubCategory = art.IDSubCategory 
    WHERE art.Status = 4 AND art.TimePublish <= now()
    GROUP BY art.IDArticle, art.Title, art.Avatar,art.Views,art.Ranks, art.TimePublish, art.IDCate, 
    c.CategoryName, us.FullName, art.IDSubCategory, subcate.SubCategoryName 
    ORDER BY art.Views DESC LIMIT 3`);
  },
  SingleWithID: async function (idPost) {
    const result = await db.load(`SELECT art.IsPremium, art.IDArticle, art.Title, art.Avatar, art.BigAvatar, art.Content, IsPremium, art.Views,art.Ranks, art.TimePublish, 
    art.IDCate, c.CategoryName, us.FullName, subcate.IDSubCategory, subcate.SubCategoryName, count(CM.comment) as numofCM 
    FROM ${TBL_article} art LEFT JOIN cate c ON c.IDCategory = art.IDCate LEFT JOIN comment CM ON CM.IDArticle = art.IDArticle 
    LEFT JOIN users us ON art.Writter = us.IDUser LEFT JOIN sub_categories subcate ON subcate.IDCategory = art.IDCate 
    AND subcate.IDSubCategory = art.IDSubCategory 
    WHERE art.Status = 4 AND art.IDArticle = ${idPost}
    GROUP BY art.IDArticle , art.Title, art.Avatar, art.BigAvatar, art.Content,IsPremium, art.Views,art.Ranks, art.TimePublish, c.IDCategory, 
    c.CategoryName, us.FullName, subcate.IDSubCategory, subcate.SubCategoryName`);
    return result[0];
  },
  RelateWithID: function (idPost) {
    return db.load(`SELECT artRelate.IsPremium, artRelate.IDArticle, artRelate.Title, artRelate.Avatar, artRelate.Views, artRelate.Ranks, 
    artRelate.TimePublish, artRelate.IDCate, c.CategoryName, subcate.IDSubCategory, subcate.SubCategoryName, 
    count(CM.comment) as numofCM FROM ${TBL_article} art LEFT JOIN cate c ON art.IDCate = c.IDCategory 
    JOIN article artRelate ON artRelate.IDSubCategory = art.IDSubCategory LEFT JOIN comment CM ON CM.IDArticle = artRelate.IDArticle 
    LEFT JOIN sub_categories subcate ON subcate.IDCategory = art.IDCate AND subcate.IDSubCategory = art.IDSubCategory
    Where artRelate.Status = 4 AND art.IDArticle = ${idPost} AND art.IDArticle != artRelate.IDArticle AND artRelate.TimePublish <= now()
    GROUP BY artRelate.IDArticle, artRelate.Title, artRelate.Avatar, artRelate.Views, artRelate.Ranks, 
    artRelate.TimePublish, artRelate.IDCate, c.CategoryName, subcate.IDSubCategory, subcate.SubCategoryName, subcate.IDSubCategory, subcate.SubCategoryName
    ORDER BY artRelate.Ranks DESC LIMIT 5`);
  },
  ArticleWithIdCate: function (idCate, current, limit) {
    return db.load(`SELECT art.IsPremium, art.IDArticle, art.Title, art.abstract, art.Avatar, art.BigAvatar, art.Views,art.Ranks, 
    art.TimePublish, art.IDCate, c.CategoryName, us.FullName, subcate.IDSubCategory, subcate.SubCategoryName, 
    count(CM.comment) as numofCM FROM ${TBL_article} art LEFT JOIN cate c ON c.IDCategory = art.IDCate LEFT JOIN 
    comment CM ON CM.IDArticle = art.IDArticle LEFT JOIN users us ON art.Writter = us.IDUser LEFT JOIN 
    sub_categories subcate ON subcate.IDCategory = art.IDCate AND subcate.IDSubCategory = art.IDSubCategory 
    WHERE art.Status = 4 AND art.IDCate = ${idCate} AND art.TimePublish <= now()
    GROUP BY art.IDArticle , art.Title, art.abstract, art.Avatar, art.BigAvatar, art.Views,art.Ranks, art.TimePublish, c.IDCategory, c.CategoryName, us.FullName, 
    subcate.IDSubCategory, subcate.SubCategoryName 
    ORDER BY art.IsPremium DESC LIMIT ${limit} OFFSET ${current}`);
  },
  ArticleWithIdSubCate: function (idSubCate, current, limit) {
    return db.load(`SELECT art.IsPremium, art.IDArticle, art.Title, art.abstract, art.Avatar, art.BigAvatar, art.Views,art.Ranks, 
    art.TimePublish, art.IDCate, c.CategoryName, us.FullName, subcate.IDSubCategory, subcate.SubCategoryName, 
    count(CM.comment) as numofCM FROM ${TBL_article} art LEFT JOIN cate c ON c.IDCategory = art.IDCate LEFT JOIN 
    comment CM ON CM.IDArticle = art.IDArticle LEFT JOIN users us ON art.Writter = us.IDUser LEFT JOIN 
    sub_categories subcate ON subcate.IDCategory = art.IDCate AND subcate.IDSubCategory = art.IDSubCategory 
    WHERE art.Status = 4 AND art.IDSubCategory = ${idSubCate} AND art.TimePublish <= now()
    GROUP BY art.IDArticle , art.Title, art.abstract, art.Avatar, art.BigAvatar, art.Views,art.Ranks, art.TimePublish, c.IDCategory, c.CategoryName, us.FullName, 
    subcate.IDSubCategory, subcate.SubCategoryName
    ORDER BY art.IsPremium DESC LIMIT ${limit} OFFSET ${current}`);
  },
  ArticleWithIdTag: function (idTag, current, limit) {
    return db.load(`SELECT art.IsPremium, art.IDArticle, art.Title, art.abstract, art.Avatar, art.BigAvatar, art.Views,art.Ranks, 
    art.TimePublish, art.IDCate, c.CategoryName, us.FullName, subcate.IDSubCategory, subcate.SubCategoryName, 
    Tag.TagName, count(CM.comment) as numofCM FROM ${TBL_article} art LEFT JOIN cate c ON c.IDCategory = art.IDCate 
    LEFT JOIN comment CM ON CM.IDArticle = art.IDArticle LEFT JOIN users us ON art.Writter = us.IDUser 
    LEFT JOIN sub_categories subcate ON subcate.IDCategory = art.IDCate AND subcate.IDSubCategory = art.IDSubCategory 
    LEFT JOIN article_tag artTag ON artTag.IDArticle = art.IDArticle LEFT JOIN tags Tag ON artTag.IDTag = Tag.IDTag 
    WHERE art.Status = 4 AND artTag.IDTag = ${idTag} AND art.TimePublish <= now()
    GROUP BY art.IDArticle , art.Title, art.abstract, art.Avatar, 
    art.BigAvatar, art.Views,art.Ranks, art.TimePublish, c.IDCategory, c.CategoryName, us.FullName, 
    subcate.IDSubCategory, subcate.SubCategoryName, Tag.TagName
    ORDER BY art.IsPremium DESC LIMIT ${limit} OFFSET ${current}`);
  },
  ArticleWithFullTextSearch: function (textSearch) {
    return db.load(`SELECT art.IsPremium, art.IDArticle, art.Title, art.abstract, art.Avatar, art.BigAvatar, art.Views,art.Ranks, 
    art.TimePublish, art.IDCate, cate.CategoryName, us.FullName, subCate.IDSubCategory, subCate.SubCategoryName, 
    count(CM.comment) as numofCM, MATCH (art.Title, art.Content, art.Abstract) AGAINST ('${textSearch}' IN NATURAL LANGUAGE MODE) as score 
    FROM ${TBL_article} art LEFT JOIN cate Cate on Cate.IDCategory = art.IDCate LEFT JOIN 
    comment CM on CM.IDArticle = art.IDArticle LEFT JOIN users us ON art.Writter = us.IDUser LEFT JOIN 
    sub_categories subCate ON subCate.IDCategory = art.IDCate AND subCate.IDSubCategory = art.IDSubCategory 
    Where art.Status = 4 AND art.TimePublish <= now() AND MATCH (art.Title, art.Content, art.Abstract) AGAINST ('${textSearch}' IN NATURAL LANGUAGE MODE) > 0
    GROUP BY art.IDArticle , art.Title, art.abstract, art.Avatar, art.BigAvatar, art.Views,art.Ranks, art.TimePublish, cate.IDCategory, cate.CategoryName, us.FullName, 
    subCate.IDSubCategory, subCate.SubCategoryName
    ORDER BY score DESC, art.IsPremium DESC limit 10`);
  },
  NumberArticleByIdAuthor: async function (idAuthor) {
    const result = await db.load(`SELECT COUNT(*) as numOfArt
    FROM ${TBL_article} art JOIN users US ON art.Writter = US.IDUser
    WHERE US.IDUser = ${idAuthor}`);
    return result[0].numOfArt;
  },
  NewArticleWithTop10Cate: function () {
    return db.load(`select p.IsPremium, p.IDArticle, p.Avatar, p.TimePublish, p.Title, p.IDCate, p.IDSubCategory, c.CategoryName, 
    subcate.SubCategoryName, p.Ranks, p.Views, count(CM.comment) as numofCM from ${TBL_article} p join 
    ( select max(p.IDArticle) as postiD from article p join (select max(TimePublish) as postdate, IDCate from 
    ${TBL_article} WHERE TimePublish <= now() group by IDCate limit 10) pc on (p.TimePublish = pc.postdate and p.IDCate = pc.IDCate) group by p.IDCate) 
    pc on p.IDArticle = pc.postiD JOIN cate c ON p.IDCate = c.IDCategory JOIN sub_categories subcate 
    ON subcate.IDSubCategory = p.IDSubCategory AND subcate.IDCategory = p.IDCate LEFT JOIN comment CM 
    on CM.IDArticle = p.IDArticle Where p.Status = 4
    GROUP BY p.IDArticle, p.Avatar, p.TimePublish, p.IDCate, 
    p.IDSubCategory, c.CategoryName, subcate.SubCategoryName, p.Ranks, p.Views`);
  },
  add: function (entity) {
    return db.add(TBL_article, entity);
  },
  addArticleWithTag: function (entity) {
    return db.add("article_tag", entity);
  },
  updateArticle: function (entity, IDArticle) {
    const condition = {
      IDArticle: IDArticle,
    };
    return db.patch(TBL_article, entity, condition);
  },
  updateCateOfArticle: function (entity, IDSubCategory) {
    const condition = {
      IDSubCategory: IDSubCategory,
    };
    return db.patch(TBL_article, entity, condition);
  },
  deleteArticleTag: function (IDArticle) {
    const condition = {
      IDArticle: IDArticle,
    };
    return db.del("article_tag", condition);
  },
  UpViewArticleByID: function (entity) {
    const condition = {
      IDArticle: entity.IDArticle,
    };
    delete entity.IDArticle;
    return db.patch(TBL_article, entity, condition);
  },
  UpRanks: function (idPost) {
    return db.UpdateByQuery(
      `Update ${TBL_article} SET Ranks = Ranks + 1 WHERE IDArticle = ${idPost}`
    );
  },
  GetLikeByID: function (idPost) {
    return db.load(
      `SELECT Ranks FROM ${TBL_article} WHERE IDArticle = ${idPost}`
    );
  },
};
