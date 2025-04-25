import { map } from 'nanostores';
import { postJSON } from '../utils/api';

// Link structure: { id, title, url, description, image, created_at, list_id }
export const linkStore = map({
  links: [],
  isLoading: false,
  error: null
});

export function setLinks(links) {
  linkStore.setKey('links', links);
}

export async function addLink({ title, url, description, image, list_id }) {
  linkStore.setKey('isLoading', true);
  linkStore.setKey('error', null);
  try {
    const newLink = await postJSON('/api/links', { title, url, description, image, list_id });
    linkStore.setKey('links', [...linkStore.get().links, newLink]);
  } catch (error) {
    linkStore.setKey('error', error.message);
  } finally {
    linkStore.setKey('isLoading', false);
  }
}

export async function fetchLinks(listId) {
  linkStore.setKey('isLoading', true);
  linkStore.setKey('error', null);
  try {
    const res = await fetch(`/api/links?listId=${encodeURIComponent(listId)}`);
    if (!res.ok) throw new Error(await res.text());
    const links = await res.json();
    linkStore.setKey('links', links);
  } catch (error) {
    linkStore.setKey('error', error.message);
  } finally {
    linkStore.setKey('isLoading', false);
  }
}

export async function updateLink(updatedLink) {
  linkStore.setKey('isLoading', true);
  linkStore.setKey('error', null);
  try {
    const res = await fetch('/api/links', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedLink),
    });
    if (!res.ok) throw new Error(await res.text());
    const link = await res.json();
    linkStore.setKey(
      'links',
      linkStore.get().links.map(l => l.id === link.id ? link : l)
    );
  } catch (error) {
    linkStore.setKey('error', error.message);
  } finally {
    linkStore.setKey('isLoading', false);
  }
}

export async function deleteLink(id) {
  linkStore.setKey('isLoading', true);
  linkStore.setKey('error', null);
  try {
    const res = await fetch('/api/links', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) throw new Error(await res.text());
    linkStore.setKey(
      'links',
      linkStore.get().links.filter(link => link.id !== id)
    );
  } catch (error) {
    linkStore.setKey('error', error.message);
  } finally {
    linkStore.setKey('isLoading', false);
  }
}
