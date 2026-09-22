import type { User } from "@/types/home";

type DocumentUploadAsideProps = {
  user: User | null;
};

const DocumentUploadAside = ({ user }: DocumentUploadAsideProps) => {
  return <aside className="h-full min-w-80 bg-sidebar">LEFT</aside>;
};

export default DocumentUploadAside;
