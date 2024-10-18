'use client'

import { useState, useEffect } from 'react'
import { saveMarkdownFile, getMarkdownContent } from '@/lib/blog/manage'

interface MarkdownFormProps {
  fileToEdit: string | null;
  onFileSaved: (oldFilename: string | null, newFilename: string) => void;
}

export default function MarkdownForm({ fileToEdit, onFileSaved }: MarkdownFormProps) {
  const [filename, setFilename] = useState('')
  const [content, setContent] = useState('')
  const [message, setMessage] = useState('')
  const [originalFilename, setOriginalFilename] = useState<string | null>(null)

  useEffect(() => {
    if (fileToEdit) {
      loadFileContent(fileToEdit)
      setOriginalFilename(fileToEdit)
    } else {
      setFilename('')
      setContent('')
      setOriginalFilename(null)
    }
  }, [fileToEdit])

  const loadFileContent = async (filename: string) => {
    try {
      const result = await getMarkdownContent(filename)
      if (result.success) {
        setFilename(filename.replace('.md', ''))
        setContent(result.content)
        setMessage('File loaded successfully.')
      } else {
        setMessage('Error loading file content')
      }
    } catch (error) {
      console.error('Error loading file:', error)
      setMessage('An error occurred while loading the file.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const result = await saveMarkdownFile(filename, content)
      setMessage(result.message)
      if (result.success) {
        onFileSaved(originalFilename, `${filename}.md`)
        if (!fileToEdit) {
          setFilename('')
          setContent('')
        }
        setOriginalFilename(`${filename}.md`)
      }
    } catch (error) {
      console.error('Error saving file:', error)
      setMessage('An error occurred while saving the file.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="filename" className="block text-sm font-medium text-gray-700">
          Filename (without .md extension)
        </label>
        <input
          type="text"
          id="filename"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        />
      </div>
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        ></textarea>
      </div>
      <div className="flex space-x-2">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          {fileToEdit ? 'Update' : 'Save'}
        </button>
      </div>
      {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
    </form>
  )
}