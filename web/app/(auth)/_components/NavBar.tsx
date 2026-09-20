import Link from "next/link";

const NavBar = () => {
  return (
    <div className="border">
      <nav className="w-full flex items-center justify-between container mx-auto py-4">
        <div className="flex items-center gap-2">
          <div className="font-display font-medium uppercase bg-primary px-2 rounded text-white">
            L
          </div>
          <span className="font-bold">AskPDF</span>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium">
            Sign in
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
