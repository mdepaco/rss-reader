// src/models/articleModel.js
export class Article {
  /**
   * @param {Object} param0
   * @param {number} [param0.id]          – asignado por IndexedDB
   * @param {number} param0.feedId        – FK al feed
   * @param {string} param0.title
   * @param {string} param0.link
   * @param {string} param0.pubDate
   * @param {string} param0.description
   */
  constructor({ id = null, feedId, title, link, pubDate, description }) {
    this.id = id;
    this.feedId = feedId;
    this.title = title;
    this.link = link;
    this.pubDate = pubDate;
    this.description = description;
  }
}