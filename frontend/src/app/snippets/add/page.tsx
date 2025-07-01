"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function AddSnippetPage() {
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("");
  const [tags, setTags] = useState("");
  const [summary, setSummary] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/snippets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        code,
        language,
        tags: tags.split(",").map((t) => t.trim()),
        summary,
      }),
    });

    // Optional: show toast, redirect, etc.
  };

  return (
    <div className="flex flex-col items-center min-h-screen">
      <div className="w-full max-w-8xl space-y-12 p-8">
        <h1 className="text-5xl font-bold font-intra">Add New Snippet</h1>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex gap-8">
            <div className="flex-3">
              <label className="block text-2xl font-intra mb-2 px-2">
                Snippet Title
              </label>
              <Input
                placeholder="Enter snippet title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="!text-base"
              />
            </div>
            <div className="flex-2">
              <label className="block text-2xl font-intra mb-2 px-2">
                Language
              </label>
              <Input
                placeholder="e.g. JavaScript"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="!text-base"
              />
            </div>
          </div>

          <div className="flex gap-8">
            <div className="flex-3">
              <label className="block text-2xl font-intra mb-2 px-2">
                Snippet Code
              </label>
              <Textarea
                placeholder="Paste your code here..."
                rows={12}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-136 !text-base"
                style={{
                  fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                  fontFeatureSettings: "normal",
                }}
              />
            </div>
            <div className="flex-2 space-y-8">
              <div>
                <label className="block text-2xl font-intra mb-2 px-2">
                  Snippet Tags
                </label>
                <Input
                  placeholder="Add tags here (comma separated)"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="!text-base"
                />
              </div>
              <div>
                <label className="block text-2xl font-intra mb-2 px-2">
                  Summary
                </label>
                <Textarea
                  placeholder="Optional summary of the code snippet..."
                  rows={8}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="h-92 !text-base"
                />
              </div>
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-black text-white font-intra w-full text-2xl hover:bg-gray-600"
                >
                  Save Snippet
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
