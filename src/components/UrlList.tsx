import { useStore } from '@nanostores/preact';
import { linkStore, addLink, deleteLink, fetchLinks } from '../stores/linkStore';
import { useState, useEffect } from 'preact/hooks';
import UrlListItem from './UrlListItem';

export default function UrlList({ listId }) {
  const { links, isLoading, error } = useStore(linkStore);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (listId) fetchLinks(listId);
  }, [listId]);

  const handleAdd = async () => {
    if (!url.trim()) return;
    await addLink({
      url,
      title,
      description,
      image: '',
      list_id: listId
    });
    setUrl('');
    setTitle('');
    setDescription('');
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="border border-gray-200 rounded-lg bg-gray-50 shadow p-6">
        <h2 className="text-xl font-bold mb-4">URLs in this List</h2>
        <div className="mb-4 flex gap-2 flex-wrap">
          <input
            className="border px-3 py-2 rounded"
            placeholder="URL"
            value={url}
            onInput={e => setUrl(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }}
            disabled={isLoading}
          />
          <input
            className="border px-3 py-2 rounded"
            placeholder="Title (optional)"
            value={title}
            onInput={e => setTitle(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }}
            disabled={isLoading}
          />
          <input
            className="border px-3 py-2 rounded"
            placeholder="Description (optional)"
            value={description}
            onInput={e => setDescription(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }}
            disabled={isLoading}
          />
          <button
            className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
            onClick={handleAdd}
            disabled={isLoading}
          >
            {isLoading ? 'Adding...' : 'Add URL'}
          </button>
        </div>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <ul className="space-y-2">
          {links.filter(link => link.list_id === listId).length === 0 ? (
            <li className="text-gray-400 italic text-center py-8">No URLs in this list yet.</li>
          ) : (
            links.filter(link => link.list_id === listId).map(link => (
              <UrlListItem key={link.id} link={link} />
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
