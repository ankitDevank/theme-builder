import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-primary/20">
      <div className="text-center space-y-4">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <h2 className="text-3xl font-semibold">Page Not Found</h2>
        <p className="text-muted-foreground">
          The page you are looking for does not exist.
        </p>
        <div className="pt-4">
          <Button asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
