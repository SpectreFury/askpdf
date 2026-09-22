import ConversationAside from "./_components/ConversationAside";
import DocumentRenderer from "./_components/DocumentRenderer";
import DocumentUploadAside from "./_components/DocumentUploadAside";

const ApplicationLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="w-full h-screen flex">
      <DocumentUploadAside user={null} />
      {children}
    </main>
  );
};

export default ApplicationLayout;
