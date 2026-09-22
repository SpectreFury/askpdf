import type { User } from "@/types/home";

type DocumentUploadAsideProps = {
  user: User;
};

const DocumentUploadAside = ({ user }: DocumentUploadAsideProps) => {
  return <aside className="h-full min-w-80 bg-sidebar"></aside>;
};

export default DocumentUploadAside;
