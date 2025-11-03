"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {
  Plus,
  Copy,
  Edit,
  Share,
  Filter,
  Trash2,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

type Snippet = {
  id: number;
  title: string;
  code: string;
  language: string;
  summary: string;
  tags: string[];
  createdAt: string;
};

export default function AllSnippetsPage() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);
  const [allSnippets, setAllSnippets] = useState<Snippet[]>([]); // Store all snippets

  // Filter state
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [createdAfter, setCreatedAfter] = useState("");
  const [createdBefore, setCreatedBefore] = useState("");

  // Extract unique languages from ALL snippets (not filtered)
  const updateAvailableLanguages = (snippetData: Snippet[]) => {
    const languages = Array.from(
      new Set(snippetData.map((s) => s.language).filter(Boolean))
    ).sort();
    setAvailableLanguages(languages);
  };

  // Fetch snippets with filters
  const fetchSnippets = async () => {
    const params = new URLSearchParams();

    // Support multiple languages
    if (selectedLanguages.length > 0) {
      selectedLanguages.forEach((lang) => params.append("language", lang));
    }
    if (createdAfter) params.append("created_after", createdAfter);
    if (createdBefore) params.append("created_before", createdBefore);
    params.append("sort_order", sortOrder);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/snippets?${params.toString()}`
    );
    const data = await res.json();
    setSnippets(data);
    // Don't update available languages from filtered results
  };

  // Initial fetch
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/snippets`)
      .then((res) => res.json())
      .then((data) => {
        setSnippets(data);
        setAllSnippets(data); // Store all snippets
        updateAvailableLanguages(data); // Set languages from all snippets
      })
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  // Auto-fetch when filters change
  useEffect(() => {
    fetchSnippets();
  }, [selectedLanguages, sortOrder, createdAfter, createdBefore]);

  // Toggle a language checkbox
  const handleLanguageToggle = (lang: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  // Delete handler
  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this snippet?"
    );
    if (!confirmed) return;

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/snippets/${id}`, {
      method: "DELETE",
    });

    // Update both filtered and all snippets
    const updatedSnippets = snippets.filter((snippet) => snippet.id !== id);
    const updatedAllSnippets = allSnippets.filter(
      (snippet) => snippet.id !== id
    );

    setSnippets(updatedSnippets);
    setAllSnippets(updatedAllSnippets);
    updateAvailableLanguages(updatedAllSnippets);
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedLanguages([]);
    setSortOrder("newest");
    setCreatedAfter("");
    setCreatedBefore("");
  };

  return (
    <div className="space-y-4 p-8">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Input
            placeholder="Search snippets..."
            className="w-100 !text-base h-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="relative">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {showFilters ? (
                <ChevronUp className="h-4 w-4 ml-2" />
              ) : (
                <ChevronDown className="h-4 w-4 ml-2" />
              )}
            </Button>

            {/* Filter Popup */}
            {showFilters && (
              <div className="absolute top-full mt-2 right-0 z-50 border rounded-lg p-6 bg-white shadow-lg space-y-6 w-96">
                {/* Header */}
                <div className="flex items-center justify-between border-b pb-4">
                  <h2 className="text-xl font-bold">Filters</h2>
                </div>

                {/* Languages */}
                <div>
                  <h3 className="font-bold text-base mb-3">Languages</h3>
                  <div className="flex flex-wrap gap-3">
                    {availableLanguages.map((lang) => (
                      <label
                        key={lang}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-full border-2 cursor-pointer transition-all ${
                          selectedLanguages.includes(lang)
                            ? "border-gray-500 bg-gray-200"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedLanguages.includes(lang)}
                          onChange={() => handleLanguageToggle(lang)}
                          className="w-4 h-4 accent-gray-500"
                        />
                        <span className="font-medium text-sm">{lang}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Sort Order */}
                <div>
                  <h3 className="font-bold text-base mb-3">Sort Order</h3>
                  <div className="flex gap-3">
                    <label
                      className={`flex items-center space-x-2 px-4 py-2 rounded-full border-2 cursor-pointer transition-all ${
                        sortOrder === "newest"
                          ? "border-gray-500 bg-gray-200"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <input
                        type="radio"
                        name="sortOrder"
                        value="newest"
                        checked={sortOrder === "newest"}
                        onChange={() => setSortOrder("newest")}
                        className="w-4 h-4 accent-gray-500"
                      />
                      <span className="font-medium text-sm">Newest First</span>
                    </label>
                    <label
                      className={`flex items-center space-x-2 px-4 py-2 rounded-full border-2 cursor-pointer transition-all ${
                        sortOrder === "oldest"
                          ? "border-gray-500 bg-gray-200"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <input
                        type="radio"
                        name="sortOrder"
                        value="oldest"
                        checked={sortOrder === "oldest"}
                        onChange={() => setSortOrder("oldest")}
                        className="w-4 h-4 accent-gray-500"
                      />
                      <span className="font-medium text-sm">Oldest First</span>
                    </label>
                  </div>
                </div>

                {/* Date Range */}
                <div>
                  <h3 className="font-bold text-base mb-3">Date Range</h3>
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Created After
                      </label>
                      <input
                        type="date"
                        value={createdAfter}
                        onChange={(e) => setCreatedAfter(e.target.value)}
                        className="w-full border-2 border-gray-300 rounded-lg p-2 text-sm focus:border-gray-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Created Before
                      </label>
                      <input
                        type="date"
                        value={createdBefore}
                        onChange={(e) => setCreatedBefore(e.target.value)}
                        className="w-full border-2 border-gray-300 rounded-lg p-2 text-sm focus:border-gray-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={resetFilters}
                    className="flex-1 rounded-full border-2 font-medium"
                  >
                    Reset
                  </Button>
                  <Button
                    onClick={() => setShowFilters(false)}
                    className="flex-1 bg-black text-white hover:bg-gray-600 rounded-full py-2 font-medium"
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <a href="/snippets/add">
          <Button className="bg-black text-white hover:bg-gray-600 h-10 w-36">
            <Plus className="h-10 w-16 mr-2" />
            Add Snippet
          </Button>
        </a>
      </div>

      {/* Snippet Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {snippets.map((snippet) => (
          <Card
            key={snippet.id}
            className="border-gray-200 hover:border-gray-300 transition-colors"
          >
            <CardHeader className="pb-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-bold font-intra">
                    {snippet.title}
                  </CardTitle>
                  <div className="text-sm text-gray-500 font-firacode mt-1">
                    {snippet.language}
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                    <Share className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={() => handleDelete(snippet.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-gray-600">{snippet.summary}</div>

              <div className="flex flex-wrap gap-1">
                {snippet.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border border-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="bg-gray-50 p-3 rounded text-xs font-firacode overflow-hidden">
                <div className="whitespace-pre-wrap">
                  {snippet.code.split("\n").slice(0, 3).join("\n")}
                </div>
                {snippet.code.split("\n").length > 3 && (
                  <div className="text-gray-400 mt-1">...</div>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{snippet.createdAt}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
