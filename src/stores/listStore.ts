import { map } from 'nanostores';

// List structure: { id, title, slug, description, created_at }
export const listStore = map({
  lists: [],
  isLoading: false,
  error: null
});

export function setLists(lists) {
  listStore.setKey('lists', lists);
}

export function addList(list) {
  listStore.setKey('lists', [...listStore.get().lists, list]);
}

export function updateList(updatedList) {
  listStore.setKey(
    'lists',
    listStore.get().lists.map(list =>
      list.id === updatedList.id ? { ...list, ...updatedList } : list
    )
  );
}

export function deleteList(id) {
  listStore.setKey(
    'lists',
    listStore.get().lists.filter(list => list.id !== id)
  );
}
