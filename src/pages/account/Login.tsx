import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { login } from "@/data/customers";
import { useAuthStore, useCurrentCustomer } from "@/store/authStore";
import { useUiStore } from "@/store/uiStore";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const authLogin = useAuthStore((s) => s.login);
  const customer = useCurrentCustomer();
  const pushToast = useUiStore((s) => s.pushToast);
  const navigate = useNavigate();
  const location = useLocation();

  if (customer) return <Navigate to="/account" replace />;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = login(email, password);
    if (!result.ok || !result.customer) {
      setError(result.error ?? "Could not log in.");
      return;
    }
    authLogin(result.customer.id);
    pushToast(`Welcome back, ${result.customer.name.split(" ")[0]}`, "success");
    const redirectTo = (location.state as { from?: string } | null)?.from;
    navigate(result.customer.role === "admin" ? "/admin" : redirectTo ?? "/account");
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl">Log In</h1>
      <p className="mt-2 text-sm text-stone">
        Demo accounts — customer: <code>demo@aurelle.lk</code> / <code>demo123</code>. Admin:{" "}
        <code>admin@aurelle.lk</code> / <code>admin123</code>.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="text-sm text-terracotta">{error}</p>}
        <Button type="submit" variant="primary" fullWidth>Log In</Button>
      </form>
      <p className="mt-6 text-sm text-stone">
        New here? <Link to="/register" className="underline">Create an account</Link>
      </p>
    </div>
  );
}
