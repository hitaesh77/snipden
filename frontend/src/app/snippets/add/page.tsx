'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
// import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

export default function AddSnippetPage() {
  const [title, setTitle] = useState('')
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('')
  const [tags, setTags] = useState('')
  const [summary, setSummary] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/snippets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        code,
        language,
        tags: tags.split(',').map((t) => t.trim()),
        summary,
      }),
    })

    // Optional: show toast, redirect, etc.
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Add New Snippet</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Snippet Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          placeholder="Language (e.g. JavaScript)"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        />
        <Input
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        {/* <Textarea
          placeholder="Code"
          rows={8}
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <Textarea
          placeholder="Optional Summary"
          rows={3}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        /> */}
        <Button type="submit" className="bg-black text-white">
          Save Snippet
        </Button>
      </form>
    </div>
  )
}