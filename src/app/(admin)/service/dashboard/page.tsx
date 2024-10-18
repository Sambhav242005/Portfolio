'use client'

import MarkdownForm from '@/components/app-components-markdown-form'
import MarkdownList from '@/components/app-components-markdown-list'
import { getMarkdownFiles } from '@/lib/blog/manage'
import { useState, useEffect } from 'react'

export default function Dashboard() {
  const [files, setFiles] = useState<string[]>([])
  const [fileToEdit, setFileToEdit] = useState<string | null>(null)

  useEffect(() => {
    fetchFiles()
  }, [])

  const fetchFiles = async () => {
    try {
      const fetchedFiles = await getMarkdownFiles()
      setFiles(fetchedFiles)
    } catch (error) {
      console.error('Error fetching markdown files:', error)
    }
  }

  const handleEditFile = (filename: string) => {
    setFileToEdit(filename)
  }

  const handleFileSaved = (oldFilename: string | null, newFilename: string) => {
    fetchFiles()
    setFileToEdit(null)
    
    if (oldFilename && oldFilename !== newFilename) {
      setFiles(prevFiles => {
        const updatedFiles = prevFiles.filter(file => file !== oldFilename)
        return [...updatedFiles, newFilename].sort()
      })
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Markdown File Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">
            {fileToEdit ? 'Edit Markdown File' : 'Create New Markdown File'}
          </h2>
          <MarkdownForm fileToEdit={fileToEdit} onFileSaved={handleFileSaved} />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Existing Markdown Files</h2>
          <MarkdownList
            files={files}
            onEditFile={handleEditFile}
            onFileDeleted={fetchFiles}
          />
        </div>
      </div>
    </div>
  )
}