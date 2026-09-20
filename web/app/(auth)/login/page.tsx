import NavBar from "../_components/NavBar";
import SignInCard from "../_components/SignInCard";

const LoginPage = () => {
  return (
    <main className="w-full">
      <NavBar />

      <div className="w-full container mx-auto mt-40">
        <div className="w-full flex items-center justify-between">
          <div className="max-w-2xl">
            <span className="uppercase text-primary font-bold text-sm">
              AskPDF suite access
            </span>

            <h1 className="mt-4 font-display font-semibold text-4xl">
              Verified answer, zero guesswork.
            </h1>

            <p className="mt-4 italic text-xl font-display text-secondary font-base">
              Log in to reconnect with your research workspace. Analyze
              literature, retrive page-level references, and index critical
              files securely.
            </p>
          </div>

          <div className="w-1/3">
            <SignInCard />
          </div>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
