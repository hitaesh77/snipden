"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Brain, CheckCircle, X } from "lucide-react";

export default function AddSnippetPage() {
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("");
  const [generatedTags, setGeneratedTags] = useState("");
  const [generatedSummary, setGeneratedSummary] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);

  const resetForm = () => {
    setTitle("");
    setCode("");
    setLanguage("");
    setGeneratedTags("");
    setGeneratedSummary("");
    setIsGenerating(false);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/snippets/add`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            code,
            language,
            tags: generatedTags,
            summary: generatedSummary,
          }),
        }
      );

      if (response.ok) {
        // Show success banner
        setShowSuccessBanner(true);

        // Reset form after a short delay to allow user to see the banner
        setTimeout(() => {
          resetForm();
          setShowSuccessBanner(false);
        }, 3000); // Hide banner and reset after 3 seconds
      }
    } catch (error) {
      console.error("Error saving snippet:", error);
      // You could add error handling here
    }
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

  // Check if all fields are filled and AI content is generated
  const canSave =
    title.trim() &&
    code.trim() &&
    language.trim() &&
    generatedTags &&
    generatedSummary;

  return (
    <div className="flex flex-col items-center min-h-screen bg-white">
      {/* Success Banner */}
      {showSuccessBanner && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-top-2">
          <CheckCircle className="w-6 h-6" />
          <span className="font-medium">Snippet saved successfully!</span>
          <button
            onClick={() => setShowSuccessBanner(false)}
            className="ml-2 hover:bg-green-600 p-1 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="w-full max-w-8xl p-8">
        <h1 className="text-5xl font-bold font-intra mb-12">Add New Snippet</h1>
        <div className="grid grid-cols-2 gap-6 h-full">
          {/* Left Column - User Input */}
          <div className="p-6">
            <div className="space-y-8">
              <div>
                <label className="block text-2xl font-intra mb-2 text-gray-700">
                  Snippet Title
                </label>
                <Input
                  placeholder="Enter snippet title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="!text-base"
                />
              </div>

              <div>
                <label className="block text-2xl font-intra mb-2 text-gray-700">
                  Language
                </label>
                <Input
                  placeholder="e.g. JavaScript"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="!text-base"
                />
              </div>

              <div>
                <label className="block text-2xl font-intra mb-2 text-gray-700">
                  Snippet Code
                </label>
                <Textarea
                  placeholder="Paste your code here..."
                  rows={20}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full !text-base resize-none h-110"
                  style={{
                    fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                    fontFeatureSettings: "normal",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Right Column - AI Generated Content */}
          <div className="flex flex-col">
            <div className="bg-gray-100 rounded-lg p-8 pt-14 shadow-sm flex flex-col min-h-96">
              {/* AI Icon and Description */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-3 bg-white rounded-full flex items-center justify-center">
                  <Brain className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-2xl font-intra mb-4 text-gray-800">
                  Analyze your code with AI
                </h3>
                <p className="text-gray-600 text-base">
                  Click below to generate tags and a summary for enhanced search
                  and organization.
                </p>
              </div>

              {/* Generate Button */}
              <div className="mb-4">
                <Button
                  type="button"
                  onClick={handleGenerateTagsAndSummary}
                  disabled={isGenerating || !code.trim()}
                  className="w-full bg-black text-white font-medium text-lg py-3 hover:bg-gray-700 disabled:opacity-50"
                >
                  {isGenerating ? "Generating..." : "Generate AI Data"}
                </Button>
              </div>

              {/* Generated Content Area - Takes up remaining space */}
              <div className="flex-1 space-y-4">
                {/* Placeholder when nothing is generated */}
                {!generatedTags && !generatedSummary && (
                  <div className="mt-4 text-gray-500 text-sm text-center">
                    <p>
                      Generated tags and summary will appear here after clicking
                      &quot;Generate AI Data&quot;
                    </p>
                  </div>
                )}
                {/* Generated Tags */}
                {generatedTags && (
                  <div className="p-4 rounded-lg">
                    <label className="block text-base font-intra mb-3 text-gray-700">
                      Generated Tags
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {getTagsArray().map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-sm text-black rounded-full border border-gray-300 bg-gray-50"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Generated Summary */}
                {generatedSummary && (
                  <div className="p-4 rounded-lg">
                    <label className="block text-base font-intra mb-3 text-gray-700">
                      Generated Summary
                    </label>
                    <div className="p-3 bg-gray-50 rounded border text-sm">
                      {generatedSummary}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Save Button - Outside and under the AI content box */}
            <div className="mt-6">
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={!canSave}
                className={`w-full font-medium text-lg py-3 ${
                  canSave
                    ? "bg-black text-white hover:bg-gray-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Save Snippet
              </Button>
              <p className="text-center text-sm text-gray-500 mt-2">
                {canSave
                  ? "Ready to save"
                  : "All fields and AI analysis required before saving"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
