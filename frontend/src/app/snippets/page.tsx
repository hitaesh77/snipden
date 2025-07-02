"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Plus, Copy, Edit, Share, Filter, Trash2 } from "lucide-react";

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

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/snippets`)
      .then((res) => res.json())
      .then((data) => setSnippets(data))
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this snippet?"
    );
    if (!confirmed) return;

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/snippets/${id}`, {
      method: "DELETE",
    });
    setSnippets((prevSnippets) =>
      prevSnippets.filter((snippet) => snippet.id !== id)
    );
  };

  return (
    <div className="space-y-4 p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Input
            placeholder="Filter snippets..."
            className="w-100 !text-base h-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button variant="outline" size="lg">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
        <a href="/snippets/add">
          <Button className="bg-black text-white hover:bg-gray-600 h-10 w-36">
            <Plus className="h-10 w-16 mr-2" />
            Add Snippet
          </Button>
        </a>
      </div>

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
                  <div className="text-sm text-gray-500 font-firacode mt-1 ">
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
