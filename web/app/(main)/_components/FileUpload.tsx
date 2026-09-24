"use client";

import { useState, useRef } from "react";
import { CloudBackup } from "lucide-react";

const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileUploadClick = () => {
    inputRef.current?.click();
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else {
      setIsDragging(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files.length) return;

    const file = e.target.files[0];
    setFile(file);

    // Upload the file -> Make a new session -> Shift the user to that session -> Process the document something like that I guess
  };

  const handleFileDrop = async (e: React.DragEvent<HTMLButtonElement>) => {
    setIsDragging(false);

    e.preventDefault();
    e.stopPropagation();

    if (!e.dataTransfer.files.length) return;

    const file = e.dataTransfer.files[0];
    setFile(file);
  };

  return (
    <button
      className={`flex flex-col items-center border-2 border-primary/80 border-dashed rounded-md p-4 hover:cursor-pointer ${isDragging ? "bg-secondary/10" : "bg-none"}`}
      onClick={handleFileUploadClick}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleFileDrop}
    >
      <CloudBackup className="text-primary pointer-events-none" />

      <p className="text-sm font-medium mt-2 pointer-events-none">
        Upload new document
      </p>
      <span className="text-xs text-secondary mt-1 pointer-events-none">
        Drag PDF here or click to browse
      </span>

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleFileUpload}
      />
    </button>
  );
};

export default FileUpload;
