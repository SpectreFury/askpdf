import NavBar from "../_components/NavBar";
import SignUpListItems from "../_components/SignUpListItems";
import SignUpCard from "../_components/SignUpCard";

const SignUpPage = () => {
  return (
    <main>
      <NavBar />

      <div className="container mx-auto">
        <div className="mt-20 flex items-center justify-between">
          <div>
            <div className="uppercase text-xs font-bold text-primary">
              Join AskPDF
            </div>

            <h1 className="mt-4 font-display font-semibold text-4xl">
              Get started on deep verified research.
            </h1>

            <div className="flex flex-col gap-4 mt-4">
              <SignUpListItems
                text="Verifiable Citations"
                description="
          No more hallucinated references. Every claim maps to exact
          bounding-box highlights on original PDFs.
          "
              />

              <SignUpListItems
                text="Isolated Context Folders"
                description="Your document uploads are completely isolated. We guarantee zero model training leakage."
              />

              <SignUpListItems
                text="Accelerated Synthesis"
                description="Instantly draft comparative matrices across dozens of active PDFs simultaneously."
              />
            </div>
          </div>

          <div>
            <SignUpCard />
          </div>
        </div>
      </div>
    </main>
  );
};

export default SignUpPage;
