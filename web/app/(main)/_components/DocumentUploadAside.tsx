import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import FileUpload from "./FileUpload";
import Sessions from "./Sessions";
import UserCard from "./UserCard";

const DocumentUploadAside = () => {
  return (
    <aside className="h-full flex min-h-0 min-w-80 shrink-0 flex-col gap-4 overflow-hidden bg-sidebar p-4">
      <div className="flex shrink-0 items-center">
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

      <Sessions />

      <UserCard />
    </aside>
  );
};

export default DocumentUploadAside;
