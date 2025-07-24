import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="page-transition flex flex-col justify-center items-center h-screen space-y-6 px-4 text-center">
      <h1 className="text-3xl font-bold">Welcome to Finsight</h1>
      <p className="max-w-md text-gray-600">
        Ask questions, get insights, and enjoy your chat experience.
      </p>
      <Link href="/chat">
        <Button>Get Started</Button>
      </Link>
    </div>
  );
}
