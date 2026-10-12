import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { login } from "@/data/customers";
import { useAuthStore, useIsAdmin } from "@/store/authStore";

export function AdminLogin() {
  const [email, setEmail] = useState("admin@aurelle.lk");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const authLogin = useAuthStore((s) => s.login);
  const isAdmin = useIsAdmin();
  const navigate = useNavigate();

  if (isAdmin) return <Navigate to="/admin" replace />;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = login(email, password);
    if (!result.ok || !result.customer || result.customer.role !== "admin") {
      setError("Invalid admin credentials.");
      return;
    }
    authLogin(result.customer.id);
    navigate("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <div className="w-full max-w-sm bg-ivory p-8">
        <h1 className="font-display text-2xl">AURELLE Admin</h1>
        <p className="mt-2 text-xs text-stone">Demo credentials: admin@aurelle.lk / admin123</p>
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <p className="text-sm text-terracotta">{error}</p>}
          <Button type="submit" variant="primary" fullWidth>Log In</Button>
        </form>
      </div>
    </div>
  );
}
