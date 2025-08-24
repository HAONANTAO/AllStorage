'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Input } from './ui/input';
import { useSearchParams } from 'next/navigation';
import { getFiles } from '@/lib/actions/file.action';
import { Models } from 'node-appwrite';
import Thumbnail from './Thumbnail';

// Whole page search function
const Search = () => {
  const [query, setQuery] = useState('');
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('query') || '';
  const [results, setResults] = useState<Models.Document[]>([]);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fetchFiles = async () => {
      const files = await getFiles({ searchText: query });
      setResults(files.documents);
      setOpen(true);
    };
    fetchFiles();
  }, [query]);

  useEffect(() => {
    if (!searchQuery) {
      // get all files
      setQuery('');
    }
  }, []);
  return (
    <div className="search">
      <div className="search-input-wrapper">
        <Image
          src="/assets/icons/search.svg"
          width={24}
          height={24}
          alt="search"
        />
        <Input
          value={query}
          placeholder="Search..."
          className="search-input"
          onChange={(e) => setQuery(e.target.value)}
        />
        {open && (
          <ul className="search-result">
            {results.length > 0 ? (
              results.map((file) => (
                <li
                  className="flex items-center justify-between"
                  key={file.$id}>
                  <div className="flex cursor-pointer items-center gap-4">
                    <Thumbnail
                      type={file.type}
                      extension={file.extension}
                      url={file.url}
                      className="size-9 min-w-9 "
                    />
                    {file.name}
                  </div>
                </li>
              ))
            ) : (
              <p className="empty-result">No files found</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Search;
