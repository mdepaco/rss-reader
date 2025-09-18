// src/models/feedModel.js
export class Feed {
  /**
   * @param {Object} param0
   * @param {number} [param0.id]   – asignado por IndexedDB (autoIncrement)
   * @param {string} param0.url    – URL del RSS
   * @param {string} param0.title  – Título del feed (obtenido vía API)
   */
  constructor({ id = null, url, title }) {
    this.id = id;
    this.url = url;
    this.title = title;
  }
}