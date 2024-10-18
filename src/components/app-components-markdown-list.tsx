'use client'

import { useState, useEffect } from 'react'
import { deleteMarkdownFile } from '@/lib/blog/manage'

interface MarkdownListProps {
  files: string[]
  onEditFile: (filename: string) => void
  onFileDeleted: () => void
}

export default function MarkdownList({ files = [], onEditFile, onFileDeleted }: MarkdownListProps) {
  const [message, setMessage] = useState('')
  const [localFiles, setLocalFiles] = useState<string[]>([])

  useEffect(() => {
    setLocalFiles(files)
  }, [files])

  const handleDelete = async (filename: string) => {
    const result = await deleteMarkdownFile(filename)
    setMessage(result.message)
    if (result.success) {
      setLocalFiles(prevFiles => prevFiles.filter(file => file !== filename))
      onFileDeleted()
    }
  }

  return (
    <div>
      {localFiles.length > 0 ? (
        <ul className="space-y-2">
          {localFiles.map((file) => (
            <li key={file} className="flex items-center justify-between bg-gray-100 p-2 rounded">
              <span>{file}</span>
              <div className="space-x-2">
                <button
                  onClick={() => onEditFile(file)}
                  className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(file)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No markdown files found.</p>
      )}
      {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
    </div>
  )
}