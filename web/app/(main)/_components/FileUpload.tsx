"use client";

import { useRef } from "react";
import { CloudBackup } from "lucide-react";

const FileUpload = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileUploadClick = () => {
    inputRef.current?.click();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if(!e.target.files || !e.target.files.length) return;

    const file = e.target.files[0];

    // Upload the file -> Make a new session -> Shift the user to that session -> Process the document something like that I guess
  };

  return (
    <button
      className="flex flex-col items-center border-2 border-primary/80 border-dashed rounded-md p-4 hover:cursor-pointer"
      onClick={handleFileUploadClick}
    >
      <CloudBackup className="text-primary" />

      <p className="text-sm font-medium mt-2">Upload new document</p>
      <span className="text-xs text-secondary mt-1">
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
