import { Modal } from "@/components/ui/Modal";
import type { SizeChartRow } from "@/data/types";

export function SizeGuideModal({ open, onClose, chart }: { open: boolean; onClose: () => void; chart: SizeChartRow[] }) {
  return (
    <Modal open={open} onClose={onClose} title="Size Guide" maxWidthClass="max-w-md">
      <p className="mb-4 text-xs text-stone">All measurements in centimetres. Garment measured flat.</p>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-stone/20 text-left text-xs uppercase tracking-wide text-stone">
            <th className="py-2">Size</th>
            <th className="py-2">Chest</th>
            <th className="py-2">Waist</th>
            <th className="py-2">Hip</th>
          </tr>
        </thead>
        <tbody>
          {chart.map((row) => (
            <tr key={row.size} className="border-b border-stone/10">
              <td className="py-2 font-medium">{row.size}</td>
              <td className="py-2">{row.chestCm}</td>
              <td className="py-2">{row.waistCm}</td>
              <td className="py-2">{row.hipCm}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Modal>
  );
}
