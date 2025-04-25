export const prerender = false;

import type { APIRoute } from 'astro';
import { Pool } from 'pg';
import fetch from 'node-fetch';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const POST: APIRoute = async ({ request }) => {
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }
  let { title, url, description, image, list_id } = body || {};
  if (!url || !list_id) {
    return new Response(JSON.stringify({ error: 'URL and list_id are required' }), { status: 400 });
  }
  // Normalize URL: prepend https:// if missing
  if (url && !/^https?:\/\//i.test(url)) {
    url = 'https://' + url;
  }
  // If title or description is empty, fetch metadata from the URL
  if (!title || !description) {
    try {
      const res = await fetch(url, { timeout: 5000 });
      const html = await res.text();
      // Extract <title>
      const titleMatch = html.match(/<title>(.*?)<\/title>/i);
      if (!title) {
        title = titleMatch ? titleMatch[1].trim() : '';
      }
      // Extract <meta name="description">
      const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i);
      if (!description) {
        description = descMatch ? descMatch[1].trim() : '';
      }
    } catch (e) {
      // If fetch fails, fallback to empty fields
      if (!title) title = '';
      if (!description) description = '';
    }
  }
  try {
    const result = await pool.query(
      'INSERT INTO links (title, url, description, image, created_at, list_id) VALUES ($1, $2, $3, $4, NOW(), $5) RETURNING *',
      [title || '', url, description || '', image || '', list_id]
    );
    return new Response(JSON.stringify(result.rows[0]), { status: 201 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};

export const GET: APIRoute = async ({ url }) => {
  const listId = url.searchParams.get('listId');
  if (!listId) {
    return new Response(JSON.stringify({ error: 'listId is required' }), { status: 400 });
  }
  try {
    const result = await pool.query(
      'SELECT * FROM links WHERE list_id = $1 ORDER BY created_at DESC',
      [listId]
    );
    return new Response(JSON.stringify(result.rows), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};

export const PATCH: APIRoute = async ({ request }) => {
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }
  const { id, title, url, description, image } = body || {};
  if (!id || !url) {
    return new Response(JSON.stringify({ error: 'id and url are required' }), { status: 400 });
  }
  // Normalize URL: prepend https:// if missing
  if (url && !/^https?:\/\//i.test(url)) {
    url = 'https://' + url;
  }
  // If title or description is empty, fetch metadata from the URL
  if (!title || !description) {
    try {
      const res = await fetch(url, { timeout: 5000 });
      const html = await res.text();
      // Extract <title>
      const titleMatch = html.match(/<title>(.*?)<\/title>/i);
      if (!title) {
        title = titleMatch ? titleMatch[1].trim() : '';
      }
      // Extract <meta name="description">
      const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i);
      if (!description) {
        description = descMatch ? descMatch[1].trim() : '';
      }
    } catch (e) {
      // If fetch fails, fallback to empty fields
      if (!title) title = '';
      if (!description) description = '';
    }
  }
  try {
    const result = await pool.query(
      'UPDATE links SET title = $1, url = $2, description = $3, image = $4 WHERE id = $5 RETURNING *',
      [title || '', url, description || '', image || '', id]
    );
    return new Response(JSON.stringify(result.rows[0]), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }
  const { id, list_id } = body || {};
  try {
    if (list_id) {
      // Delete all links for a given list
      await pool.query('DELETE FROM links WHERE list_id = $1', [list_id]);
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } else if (id) {
      // Delete a single link by id
      await pool.query('DELETE FROM links WHERE id = $1', [id]);
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ error: 'id or list_id is required' }), { status: 400 });
    }
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};
