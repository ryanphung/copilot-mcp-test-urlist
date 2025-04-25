import { map } from 'nanostores';

// Link structure: { id, title, url, description, image, created_at, list_id }
export const linkStore = map({
  links: [],
  isLoading: false,
  error: null
});

export function setLinks(links) {
  linkStore.setKey('links', links);
}

export function addLink(link) {
  linkStore.setKey('links', [...linkStore.get().links, link]);
}

export function updateLink(updatedLink) {
  linkStore.setKey(
    'links',
    linkStore.get().links.map(link =>
      link.id === updatedLink.id ? { ...link, ...updatedLink } : link
    )
  );
}

export function deleteLink(id) {
  linkStore.setKey(
    'links',
    linkStore.get().links.filter(link => link.id !== id)
  );
}
