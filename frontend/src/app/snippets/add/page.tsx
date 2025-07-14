"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function AddSnippetPage() {
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("");
  const [generatedTags, setGeneratedTags] = useState("");
  const [generatedSummary, setGeneratedSummary] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/snippets/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        code,
        language,
        tags: generatedTags,
        summary: generatedSummary,
      }),
    });
    // Optional: show toast, redirect, etc.
  };

  const handleGenerateTagsAndSummary = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/snippets/generate_tags_summary`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setGeneratedTags(data.tags || "");
        setGeneratedSummary(data.summary || "");
      }
    } catch (error) {
      console.error("Error generating tags and summary:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper function to process tags into an array
  const getTagsArray = () => {
    if (!generatedTags) return [];
    if (Array.isArray(generatedTags)) {
      return generatedTags;
    }
    return generatedTags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  };

  return (
    <div className="flex flex-col items-center min-h-screen">
      <div className="w-full max-w-8xl space-y-12 p-8">
        <h1 className="text-5xl font-bold font-intra">Add New Snippet</h1>
        <div className="space-y-8">
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
            <div className="flex-2 mt-10">
              <Button
                type="button"
                onClick={handleGenerateTagsAndSummary}
                disabled={isGenerating || !code.trim()}
                className="bg-black text-white font-intra w-full text-2xl hover:bg-gray-600"
              >
                {isGenerating ? "Generating..." : "Generate Tags and Summary"}
              </Button>
            </div>
          </div>

          <div className="flex gap-8">
            <div className="flex-3">
              <label className="block text-2xl font-intra mb-2 px-2">
                Language
              </label>
              <Input
                placeholder="e.g. JavaScript"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="!text-base mb-8"
              />

              <label className="block text-2xl font-intra mb-2 px-2">
                Snippet Code
              </label>
              <Textarea
                placeholder="Paste your code here..."
                rows={12}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-114 !text-base"
                style={{
                  fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                  fontFeatureSettings: "normal",
                }}
              />
            </div>
            <div className="flex-2 space-y-5">
              {/* Separate box for tags */}
              {generatedTags && (
                <div className="p-4 rounded-lg border">
                  <label className="block text-lg font-intra mb-3 text-black">
                    Generated Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {getTagsArray().map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 mb-2 text-black text-sm rounded-full border border-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Separate box for summary */}
              {generatedSummary && (
                <div className="p-4 rounded-lg border h-104">
                  <label className="block text-lg font-intra mb-3 text-black">
                    Generated Summary
                  </label>
                  <div className="p-3 bg-white rounded border text-sm mb-2">
                    {generatedSummary}
                  </div>
                </div>
              )}

              {/* Placeholder when nothing is generated */}
              {!generatedTags && !generatedSummary && (
                <div className="p-4 rounded-lg border h-138 bg-gray-50">
                  <div className="h-full text-gray-500">
                    <p className="text-base">
                      Generated tags and summary will appear here after clicking
                      &quot;Generate Tags and Summary&quot;
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={handleSubmit}
                  className="bg-black text-white font-intra w-full text-2xl hover:bg-gray-600"
                >
                  Save Snippet
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
