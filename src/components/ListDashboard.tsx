import { useStore } from '@nanostores/preact';
import { listStore, addList, deleteList, fetchLists, updateList } from '../stores/listStore';
import { useState, useEffect } from 'preact/hooks';
import { decodeHtml } from '../utils/decodeHtml';

export default function ListDashboard({ onSelect, selectedId }) {
  const { lists, isLoading, error } = useStore(listStore);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingSlugId, setEditingSlugId] = useState(null);
  const [slugInput, setSlugInput] = useState('');
  const [slugError, setSlugError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchLists();
  }, []);

  const handleAdd = async () => {
    if (!title.trim()) return;
    await addList({
      title,
      slug: title.toLowerCase().replace(/\s+/g, '-'),
      description
    });
    setTitle('');
    setDescription('');
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Lists</h1>
      <div className="mb-6">
        <input
          className="border px-3 py-2 rounded mr-2"
          placeholder="List title"
          value={title}
          onInput={e => setTitle(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }}
          disabled={isLoading}
        />
        <input
          className="border px-3 py-2 rounded mr-2"
          placeholder="Description (optional)"
          value={description}
          onInput={e => setDescription(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }}
          disabled={isLoading}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={handleAdd}
          disabled={isLoading}
        >
          {isLoading ? 'Adding...' : 'Add List'}
        </button>
      </div>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <ul className="space-y-2">
        {lists.length === 0 ? (
          <li className="text-gray-400 italic text-center py-8">No lists yet. Create your first list!</li>
        ) : (
          lists.map(list => (
            <li
              key={list.id}
              className={`cursor-pointer bg-white p-3 rounded shadow flex justify-between items-center transition-colors ${selectedId === list.id ? 'bg-blue-100' : ''}`}
              onClick={() => onSelect && onSelect(list.id)}
            >
              <div>
                <div className="font-semibold">{decodeHtml(list.title)}</div>
                <div className="text-sm text-gray-500">{decodeHtml(list.description)}</div>
                {selectedId === list.id && (
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-xs text-gray-400">URL:</span>
                    {editingSlugId === list.id ? (
                      <>
                        <input
                          className="border px-2 py-1 rounded text-xs"
                          value={slugInput}
                          onInput={e => setSlugInput(e.target.value)}
                          autoFocus
                        />
                        <button
                          className="text-green-600 text-xs font-semibold"
                          onClick={async e => {
                            e.stopPropagation();
                            setSlugError('');
                            try {
                              await updateList({ id: list.id, slug: slugInput });
                              setEditingSlugId(null);
                            } catch (err) {
                              setSlugError('Slug is already taken or invalid');
                            }
                          }}
                        >
                          Save
                        </button>
                        <button
                          className="text-xs text-gray-500"
                          onClick={e => { e.stopPropagation(); setEditingSlugId(null); }}
                        >
                          Cancel
                        </button>
                        {slugError && <span className="text-xs text-red-500 ml-2">{slugError}</span>}
                      </>
                    ) : (
                      <>
                        <span className="text-xs text-blue-700 font-mono">{list.slug || '(auto)'}</span>
                        <button
                          className="text-xs text-blue-600 underline"
                          onClick={e => {
                            e.stopPropagation();
                            setEditingSlugId(list.id);
                            setSlugInput(list.slug || '');
                          }}
                        >
                          Edit
                        </button>
                        <span className="ml-2 text-xs text-gray-500">Share:</span>
                        <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                          {`${window.location.origin}/list/${list.slug}`}
                        </span>
                        <button
                          className="ml-1 text-xs bg-blue-100 px-2 py-1 rounded hover:bg-blue-200"
                          onClick={async e => {
                            e.stopPropagation();
                            await navigator.clipboard.writeText(`${window.location.origin}/list/${list.slug}`);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 1500);
                          }}
                        >
                          {copied ? 'Copied!' : 'Copy Link'}
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
              <button
                className="text-red-500 hover:underline"
                onClick={e => { e.stopPropagation(); deleteList(list.id); }}
              >
                Delete
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
