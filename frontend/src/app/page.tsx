"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/snippets/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="flex flex-col items-center w-full max-w-2xl -mt-32">
        {/* Logo */}
        <div className="mb-10">
          <h1 className="text-7xl font-intra font-bold tracking-tight text-gray-900">
            Snipden
          </h1>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="w-full">
          <div className="relative group">
            <div className="flex items-center w-full border border-gray-300 rounded-full px-6 py-4 shadow-sm hover:shadow-md focus-within:shadow-md transition-shadow bg-white">
              <svg
                className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search code snippets..."
                className="flex-1 text-base font-intra outline-none"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
