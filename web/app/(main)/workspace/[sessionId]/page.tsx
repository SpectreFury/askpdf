import ConversationAside from "../../_components/ConversationAside";
import DocumentRenderer from "../../_components/DocumentRenderer";

const WorkspaceSession = async ({ params }: PageProps<"/workspace/[sessionId]">) => {
  const { sessionId } = await params;

  return (
    <>
      <DocumentRenderer sessionId={sessionId} />
      <ConversationAside sessionId={sessionId} />
    </>
  );
};

export default WorkspaceSession;
