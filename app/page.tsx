import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex justify-center items-center h-screen">
      
      <Link href="/chat">
        <Button className="ml-4">Get Started</Button>
      </Link>

    </div>
  );
}
