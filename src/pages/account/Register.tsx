import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { register } from "@/data/customers";
import { useAuthStore, useCurrentCustomer } from "@/store/authStore";
import { useUiStore } from "@/store/uiStore";

export function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const authLogin = useAuthStore((s) => s.login);
  const customer = useCurrentCustomer();
  const pushToast = useUiStore((s) => s.pushToast);
  const navigate = useNavigate();

  if (customer) return <Navigate to="/account" replace />;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = register({ name, email, phone, password });
    if (!result.ok || !result.customer) {
      setError(result.error ?? "Could not create account.");
      return;
    }
    authLogin(result.customer.id);
    pushToast("Account created — welcome to VALESTRA", "success");
    navigate("/account");
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl">Create Account</h1>
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
        {error && <p className="text-sm text-terracotta">{error}</p>}
        <Button type="submit" variant="primary" fullWidth>Create Account</Button>
      </form>
      <p className="mt-6 text-sm text-stone">
        Already have an account? <Link to="/login" className="underline">Log in</Link>
      </p>
    </div>
  );
}
