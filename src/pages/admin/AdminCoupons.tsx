import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { getCoupons, upsertCoupon, deleteCoupon } from "@/data/coupons";
import { formatLKR } from "@/lib/format";
import type { Coupon } from "@/data/types";

const emptyForm = { code: "", type: "percent" as Coupon["type"], value: 10, minSubtotalCents: undefined as number | undefined, active: true };

export function AdminCoupons() {
  const [coupons, setCoupons] = useState(() => getCoupons());
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const [form, setForm] = useState(emptyForm);

  function openAdd() {
    setEditingId(undefined);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(coupon: Coupon) {
    setEditingId(coupon.id);
    setForm({ code: coupon.code, type: coupon.type, value: coupon.value, minSubtotalCents: coupon.minSubtotalCents, active: coupon.active });
    setModalOpen(true);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    upsertCoupon({ ...form, id: editingId });
    setCoupons(getCoupons());
    setModalOpen(false);
  }

  function handleDelete(id: string) {
    if (!window.confirm("Delete this coupon?")) return;
    deleteCoupon(id);
    setCoupons(getCoupons());
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl">Coupons</h1>
        <Button variant="primary" onClick={openAdd}>Add Coupon</Button>
      </div>

      <div className="overflow-x-auto border border-stone/15">
        <table className="w-full text-left text-sm">
          <thead className="bg-sand/60 text-xs uppercase tracking-wide text-stone">
            <tr>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Value</th>
              <th className="px-4 py-3">Min Subtotal</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id} className="border-t border-stone/10">
                <td className="px-4 py-3 font-medium">{c.code}</td>
                <td className="px-4 py-3 capitalize">{c.type}</td>
                <td className="px-4 py-3">{c.type === "percent" ? `${c.value}%` : formatLKR(c.value)}</td>
                <td className="px-4 py-3">{c.minSubtotalCents ? formatLKR(c.minSubtotalCents) : "—"}</td>
                <td className="px-4 py-3">{c.active ? "Yes" : "No"}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => openEdit(c)} className="focus-ring mr-3 underline">Edit</button>
                  <button onClick={() => handleDelete(c.id)} className="focus-ring text-terracotta underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Coupon" : "Add Coupon"}>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <Input label="Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} required />
          <Select label="Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as Coupon["type"] })}>
            <option value="percent">Percent off</option>
            <option value="flat">Flat amount off (LKR)</option>
          </Select>
          <Input
            label={form.type === "percent" ? "Percent value" : "Flat value (LKR)"}
            type="number"
            value={form.type === "percent" ? form.value : form.value / 100}
            onChange={(e) => setForm({ ...form, value: form.type === "percent" ? Number(e.target.value) : Math.round(Number(e.target.value) * 100) })}
            required
          />
          <Input
            label="Minimum subtotal (LKR, optional)"
            type="number"
            value={form.minSubtotalCents ? form.minSubtotalCents / 100 : ""}
            onChange={(e) => setForm({ ...form, minSubtotalCents: e.target.value ? Math.round(Number(e.target.value) * 100) : undefined })}
          />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="accent-terracotta" />
            Active
          </label>
          <Button type="submit" variant="primary">Save Coupon</Button>
        </form>
      </Modal>
    </div>
  );
}
