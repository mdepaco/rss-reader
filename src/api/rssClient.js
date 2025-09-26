// src/api/rssClient.js
import RSSParser from 'https://cdn.jsdelivr.net/npm/@jarryd999/rss-parser-browser@1.0.6';

const parser = new RSSParser();

/**
 * Obtiene y parsea un feed RSS/Atom.
 * @param {string} url URL completa del feed.
 * @returns {Promise<{feed:object, items:Array<object>}>}
 */
export async function downloadAndParse(url) {
  const resp = await fetch(url, { mode: 'cors' });
  if (!resp.ok) throw new Error(`Error ${resp.status} al obtener el feed`);

  const xml = await resp.text();               
  const parsed = await parser.parseString(xml); 
  return {
    feed: { title: parsed.title, link: parsed.link },
    items: parsed.items.map(i => ({
      title: i.title,
      link: i.link,
      pubDate: i.pubDate,
      content: i.content || i['content:encoded'] || '',
      snippet: i.contentSnippet || ''
    }))
  };
}