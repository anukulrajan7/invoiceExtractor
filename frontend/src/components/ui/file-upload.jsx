import { useState } from "react"
import { Upload, File, X } from "lucide-react"
import { Button } from "./button"

export function FileUpload({ onFileSelect }) {
  const [selectedFile, setSelectedFile] = useState(null)

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    setSelectedFile(file)
    if (onFileSelect) onFileSelect(file)
  }

  const removeFile = () => {
    setSelectedFile(null)
    if (onFileSelect) onFileSelect(null)
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-4 text-gray-500" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500">
              PDF, XLSX, or Image files
            </p>
          </div>
          <input
            type="file"
            className="hidden"
            onChange={handleFileSelect}
            accept=".pdf,.xlsx,.xls,.jpg,.jpeg,.png"
          />
        </label>
      </div>

      {selectedFile && (
        <div className="mt-4 p-4 bg-white rounded-lg border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <File className="w-4 h-4" />
              <span className="text-sm font-medium">{selectedFile.name}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={removeFile}
              className="text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
} 