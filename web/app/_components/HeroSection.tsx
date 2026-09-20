import { Dot, File } from "lucide-react";
import Link from "next/link";

const HeroSection = () => {
  return (
    <div className="flex gap-20">
      <div className="max-w-2xl">
        <div className="w-fit text-sm font-bold flex items-center px-2 py-1 rounded-full border border-primary bg-accent/40 text-primary">
          Introducing AskPDF v1.0 <Dot /> RAG powered
        </div>

        <h1 className="mt-10 font-display font-semibold text-6xl">
          Smarter research starts with your documents.
        </h1>

        <p className="mt-4 italic text-xl font-display text-secondary font-base">
          AskPDF instantly parses your complex academic papers, climate policy
          reports and financial briefs. Ask questions and get instant answers
          backend by verifiable in-line citations{" "}
        </p>

        <div className="mt-10 flex items-center gap-4">
          <Link
            href="/signup"
            className="font-medium text-card bg-primary py-3 px-6 rounded-md"
          >
            Get Started Free
          </Link>
          <Link
            href="/login"
            className="font-medium text-headers border py-3 px-6 rounded-md"
          >
            Sign in
          </Link>
        </div>

        <div className="mt-4 text-sm text-secondary font-medium">
          Trusted by 24,000+ researchers, policymakers, and academics
        </div>
      </div>

      <div className="flex flex-col bg-card p-8 rounded-md border">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <File size={20} className="text-primary" />
            <span className="font-medium">
              Decarbonization_Pathways_Report.pdf
            </span>
          </div>

          <div className="text-primary font-bold text-sm bg-accent rounded px-2 py-1">
            Index Complete
          </div>
        </div>

        <div className="border-l-3 border-primary pl-4 mt-4">
          <div className="font-display font-semibold text-lg text-primary">
            Abstract
          </div>
          <div className="font-display italic text-lg">
            This paper models critic fiscal constraints facing soverign states.
          </div>
        </div>

        <div className="bg-secondary/5 p-4 rounded-md mt-4">
          <div className="uppercase text-primary font-bold text-sm">
            AskPDF Assistant
          </div>
          <div className="text-headers">
            "The primary structural soverign debt risk originates from regional
            contractions. GDP falls up to 40% in affected areas."
          </div>

          <div className="text-primary bg-accent/40 border border-primary font-semibold w-fit p-1 text-sm rounded-md mt-2">
            Page 3, Paragraph 4
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
