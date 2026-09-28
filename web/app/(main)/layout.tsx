import ConversationAside from "./_components/ConversationAside";
import DocumentRenderer from "./_components/DocumentRenderer";
import DocumentUploadAside from "./_components/DocumentUploadAside";

const ApplicationLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="w-full h-screen flex overflow-hidden">
      <DocumentUploadAside />
      {children}
    </main>
  );
};

export default ApplicationLayout;
