import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useCurrentCustomer } from "@/store/authStore";
import { addAddress, updateAddress, deleteAddress } from "@/data/customers";
import { DISTRICTS } from "@/data/mock/locations";
import type { Address } from "@/data/types";

const DISTRICT_NAMES = Object.keys(DISTRICTS);
const emptyForm = { label: "Home", recipientName: "", phone: "", district: DISTRICT_NAMES[0], city: DISTRICTS[DISTRICT_NAMES[0]][0], addressLine: "", isDefault: false };

export function Addresses() {
  const customer = useCurrentCustomer();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);
  const [form, setForm] = useState(emptyForm);

  if (!customer) return null;
  const customerId = customer.id;

  function openAdd() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(address: Address) {
    setEditing(address);
    setForm(address);
    setModalOpen(true);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (editing) {
      updateAddress(customerId, { ...editing, ...form });
    } else {
      addAddress(customerId, form);
    }
    setModalOpen(false);
  }

  function handleDelete(id: string) {
    deleteAddress(customerId, id);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl">Addresses</h1>
        <Button variant="outline" size="sm" onClick={openAdd}>Add Address</Button>
      </div>

      {customer.addresses.length === 0 ? (
        <p className="text-sm text-stone">No saved addresses yet.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {customer.addresses.map((address) => (
            <li key={address.id} className="border border-stone/15 p-4 text-sm">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-medium">{address.label}</span>
                {address.isDefault && <span className="text-xs text-terracotta">Default</span>}
              </div>
              <p>{address.recipientName}</p>
              <p className="text-stone">{address.phone}</p>
              <p className="text-stone">{address.addressLine}</p>
              <p className="text-stone">{address.city}, {address.district}</p>
              <div className="mt-3 flex gap-3 text-xs">
                <button onClick={() => openEdit(address)} className="focus-ring underline">Edit</button>
                <button onClick={() => handleDelete(address.id)} className="focus-ring text-terracotta underline">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Address" : "Add Address"}>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <Input label="Label" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} required />
          <Input label="Recipient name" value={form.recipientName} onChange={(e) => setForm({ ...form, recipientName: e.target.value })} required />
          <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
          <Select label="District" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value, city: DISTRICTS[e.target.value][0] })}>
            {DISTRICT_NAMES.map((d) => <option key={d} value={d}>{d}</option>)}
          </Select>
          <Select label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}>
            {DISTRICTS[form.district].map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
          <Input label="Street address" value={form.addressLine} onChange={(e) => setForm({ ...form, addressLine: e.target.value })} required />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} className="accent-terracotta" />
            Set as default address
          </label>
          <Button type="submit" variant="primary">Save Address</Button>
        </form>
      </Modal>
    </div>
  );
}
