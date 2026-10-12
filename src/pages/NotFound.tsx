import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";

export function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-32 text-center">
      <span className="font-display text-6xl text-terracotta">404</span>
      <h1 className="font-display text-2xl">Page not found</h1>
      <p className="text-sm text-stone">The page you're looking for doesn't exist or has moved.</p>
      <Link to="/">
        <Button variant="primary">Back to Home</Button>
      </Link>
    </div>
  );
}
