"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Plus, Copy, Edit, Share, Filter, Badge } from "lucide-react";

type Snippet = {
  id: number;
  title: string;
  code: string;
  language: string;
  summary: string;
  tags: string[];
  createdAt: number;
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
        <Button className="bg-black text-white hover:bg-gray-600 h-10 w-36">
          <Plus className="h-10 w-16 mr-2" />
          Add Snippet
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {snippets.map((snippet) => (
          <Card
            key={snippet.id}
            className="border-gray-200 hover:border-gray-300 transition-colors"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-sm font-medium">
                    {snippet.title}
                  </CardTitle>
                  <div className="text-xs text-gray-500 font-mono mt-1">
                    {snippet.language}
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                    <Share className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-xs text-gray-600">{snippet.summary}</div>

              <div className="flex flex-wrap gap-1">
                {snippet.tags.map((tag) => (
                  <Badge key={tag} className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="bg-gray-50 p-2 rounded text-xs font-mono overflow-hidden">
                <div className="truncate">{snippet.code.split("\n")[0]}</div>
                <div className="text-gray-400">...</div>
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
