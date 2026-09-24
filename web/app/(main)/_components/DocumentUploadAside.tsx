import { Button } from "@/components/ui/button";
import type { User } from "@/types/home";
import { Plus } from "lucide-react";
import FileUpload from "./FileUpload";

type DocumentUploadAsideProps = {
  user: User | null;
};

const DocumentUploadAside = ({ user }: DocumentUploadAsideProps) => {
  return (
    <aside className="h-full flex flex-col gap-4 min-w-80 bg-sidebar p-4">
      <div className="flex items-center">
        <div className="w-full flex items-center gap-2">
          <div className="font-display font-medium uppercase bg-primary px-2 rounded text-white">
            L
          </div>
          <span className="font-bold">AskPDF</span>
        </div>

        <Button variant="outline">
          <Plus />
        </Button>
      </div>

      <FileUpload />
    </aside>
  );
};

export default DocumentUploadAside;
