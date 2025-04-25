import { map } from 'nanostores';
import { postJSON } from '../utils/api';

// List structure: { id, title, slug, description, created_at }
export const listStore = map({
  lists: [],
  isLoading: false,
  error: null
});

export function setLists(lists) {
  listStore.setKey('lists', lists);
}

export async function addList({ title, description, slug }) {
  listStore.setKey('isLoading', true);
  listStore.setKey('error', null);
  try {
    const newList = await postJSON('/api/lists', { title, description, slug });
    listStore.setKey('lists', [...listStore.get().lists, newList]);
  } catch (error) {
    listStore.setKey('error', error.message);
  } finally {
    listStore.setKey('isLoading', false);
  }
}

export async function fetchLists() {
  listStore.setKey('isLoading', true);
  listStore.setKey('error', null);
  try {
    const res = await fetch('/api/lists');
    if (!res.ok) throw new Error(await res.text());
    const lists = await res.json();
    listStore.setKey('lists', lists);
  } catch (error) {
    listStore.setKey('error', error.message);
  } finally {
    listStore.setKey('isLoading', false);
  }
}

export async function updateList(updatedList) {
  listStore.setKey('isLoading', true);
  listStore.setKey('error', null);
  try {
    const res = await fetch('/api/lists', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedList),
    });
    if (!res.ok) throw new Error(await res.text());
    const list = await res.json();
    listStore.setKey(
      'lists',
      listStore.get().lists.map(l => l.id === list.id ? list : l)
    );
  } catch (error) {
    listStore.setKey('error', error.message);
  } finally {
    listStore.setKey('isLoading', false);
  }
}

export async function deleteList(id) {
  listStore.setKey('isLoading', true);
  listStore.setKey('error', null);
  try {
    // Delete all links for this list first
    await fetch('/api/links', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ list_id: id }),
    });
    // Then delete the list itself
    const res = await fetch('/api/lists', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) throw new Error(await res.text());
    listStore.setKey(
      'lists',
      listStore.get().lists.filter(list => list.id !== id)
    );
  } catch (error) {
    listStore.setKey('error', error.message);
  } finally {
    listStore.setKey('isLoading', false);
  }
}
