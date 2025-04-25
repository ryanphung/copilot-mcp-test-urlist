export const prerender = false;

import type { APIRoute } from 'astro';
import { Pool } from 'pg';
import { generateSlug } from '../../utils/slug';

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
  let { title, description, slug } = body || {};
  if (!title) {
    return new Response(JSON.stringify({ error: 'Title is required' }), { status: 400 });
  }
  // Generate a unique slug if not provided
  if (!slug) {
    let unique = false;
    let candidate;
    while (!unique) {
      candidate = generateSlug();
      const check = await pool.query('SELECT id FROM lists WHERE slug = $1', [candidate]);
      if (check.rows.length === 0) unique = true;
    }
    slug = candidate;
  }
  try {
    const result = await pool.query(
      'INSERT INTO lists (title, description, slug, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
      [title, description || '', slug]
    );
    return new Response(JSON.stringify(result.rows[0]), { status: 201 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};

export const GET: APIRoute = async () => {
  try {
    const result = await pool.query('SELECT * FROM lists ORDER BY created_at DESC');
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
  const { id, slug, title, description } = body || {};
  if (!id || !slug) {
    return new Response(JSON.stringify({ error: 'id and slug are required' }), { status: 400 });
  }
  // Check for slug uniqueness (excluding this list)
  const check = await pool.query('SELECT id FROM lists WHERE slug = $1 AND id != $2', [slug, id]);
  if (check.rows.length > 0) {
    return new Response(JSON.stringify({ error: 'Slug is already taken' }), { status: 409 });
  }
  try {
    const result = await pool.query(
      'UPDATE lists SET slug = $1, title = COALESCE($2, title), description = COALESCE($3, description) WHERE id = $4 RETURNING *',
      [slug, title, description, id]
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
  const { id } = body || {};
  if (!id) {
    return new Response(JSON.stringify({ error: 'id is required' }), { status: 400 });
  }
  try {
    await pool.query('DELETE FROM lists WHERE id = $1', [id]);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};
