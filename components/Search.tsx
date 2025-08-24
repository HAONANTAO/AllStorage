'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Input } from './ui/input';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { getFiles } from '@/lib/actions/file.action';
import { Models } from 'node-appwrite';
import Thumbnail from './Thumbnail';
import FormatedDateTime from './FormatedDateTime';

// Whole page search function
const Search = () => {
  const [query, setQuery] = useState('');
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('query') || '';
  const [results, setResults] = useState<Models.Document[]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const path = usePathname();
  useEffect(() => {
    const fetchFiles = async () => {
      if (!query) {
        setResults([]);
        setOpen(false);
        // returning back to the page
        return router.push(path.replace(searchParams.toString(), ''));
      }
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

  const handleClickItem = (file: Models.Document) => {
    // clear
    setOpen(false);
    setResults([]);
    // and open this items in router
    // TODO:没输入的时候点击可以跳转 但是不是单独显示
    router.push(
      `/${file.type === 'video' || 'audio' ? 'media' : file.type + 's'}?query=${query}`,
    );
  };
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
                  <div
                    className="flex cursor-pointer items-center gap-4"
                    onClick={() => handleClickItem(file)}>
                    <Thumbnail
                      type={file.type}
                      extension={file.extension}
                      url={file.url}
                      className="size-9 min-w-9 "
                    />
                    <p className="subtitle-2 line-clamp-1 text-light-100">
                      {file.name}
                    </p>
                  </div>
                  <FormatedDateTime
                    className="caption line-clamp-1 text-light-200"
                    date={file.$createdAt}
                  />
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
