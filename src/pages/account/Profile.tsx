import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useCurrentCustomer } from "@/store/authStore";
import { updateProfile } from "@/data/customers";
import { useUiStore } from "@/store/uiStore";

export function Profile() {
  const customer = useCurrentCustomer();
  const pushToast = useUiStore((s) => s.pushToast);
  const [name, setName] = useState(customer?.name ?? "");
  const [email, setEmail] = useState(customer?.email ?? "");
  const [phone, setPhone] = useState(customer?.phone ?? "");

  if (!customer) return null;
  const customerId = customer.id;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateProfile(customerId, { name, email, phone });
    pushToast("Profile updated", "success");
  }

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl">Profile</h1>
      <form onSubmit={handleSubmit} className="flex max-w-sm flex-col gap-4">
        <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        <Button type="submit" variant="primary">Save Changes</Button>
      </form>
    </div>
  );
}
