import { useStore } from '@nanostores/preact';
import { listStore } from '../stores/listStore';
import { useState } from 'preact/hooks';
import ListDashboard from './ListDashboard';
import UrlList from './UrlList';

export default function ListManager() {
  const { lists } = useStore(listStore);
  const [selectedId, setSelectedId] = useState(lists[0]?.id || null);

  // Update selectedId if lists change and selectedId is no longer valid
  if (lists.length && !lists.find(l => l.id === selectedId)) {
    setSelectedId(lists[0].id);
  }

  return (
    <div>
      <ListDashboard onSelect={setSelectedId} selectedId={selectedId} />
      {selectedId && <UrlList listId={selectedId} />}
    </div>
  );
}
