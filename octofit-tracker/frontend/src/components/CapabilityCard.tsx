import { useEffect, useState, type ReactNode } from 'react';
import { getJson } from '../api/client.js';

type Props<T> = {
  title: string;
  description: string;
  path: string;
  emptyText: string;
  renderItems: (data: T) => ReactNode;
};

export function CapabilityCard<T>({ title, description, path, emptyText, renderItems }: Props<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    getJson<T>(path)
      .then((result) => {
        if (active) setData(result);
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : 'Unable to load data');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [path]);

  return (
    <section className="card h-100">
      <div className="card-body">
        <h2 className="h4">{title}</h2>
        <p>{description}</p>
        {loading && <p role="status">Loading {title.toLowerCase()}...</p>}
        {error && <p role="alert">Unable to load {title.toLowerCase()}: {error}</p>}
        {!loading && !error && data && renderItems(data)}
        {!loading && !error && data && emptyText && (
          <p className="empty-content d-none">{emptyText}</p>
        )}
      </div>
    </section>
  );
}
