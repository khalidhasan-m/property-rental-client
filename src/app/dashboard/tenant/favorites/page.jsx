"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Chip, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { HeartOff } from "lucide-react";
import toast from "react-hot-toast";
import { api, getApiErrorMessage } from "@/lib/api";
import { LoadingState } from "@/components/LoadingState";

export default function FavoritesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [removing, setRemoving] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });

  useEffect(() => {
    setLoading(true);
    api.get("/favorites", { params: { page, limit: 10 } })
      .then(({ data }) => {
        setItems(data.data || []);
        setPagination(data.pagination || { page, limit: 10, total: 0, pages: 1 });
      })
      .catch(() => {
        setItems([]);
        setPagination({ page: 1, limit: 10, total: 0, pages: 1 });
      })
      .finally(() => setLoading(false));
  }, [page]);

  const remove = async () => {
    if (!selected) return;
    setRemoving(true);
    try {
      await api.delete(`/favorites/${selected._id}`);
      setItems((old) => old.filter((item) => item._id !== selected._id));
      toast.success("Favorite removed");
      setSelected(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setRemoving(false);
    }
  };

  if (loading) return <LoadingState label="Loading your favorites…" />;

  return (
    <div>
      <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--brand)]">Tenant dashboard</span>
      <h1 className="mt-2 text-3xl font-black tracking-[-.04em]">Saved properties</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">Keep potential homes close while you decide.</p>
      {items.length ? (
        <div className="mt-7 min-w-0 max-w-full overflow-x-auto overscroll-x-contain rounded-3xl border border-[var(--line)] bg-[var(--surface)]">
          <table className="dashboard-table w-full min-w-[720px] lg:min-w-0 text-left text-sm">
            <thead className="border-b border-[var(--line)] bg-emerald-50/60 text-xs uppercase tracking-wide text-[var(--muted)] dark:bg-emerald-950/50">
              <tr><th className="p-4">Property</th><th className="p-4">Location</th><th className="p-4">Type</th><th className="p-4">Rent</th><th className="p-4">Action</th></tr>
            </thead>
            <tbody>
              {items.map((property) => (
                <tr key={property._id} className="border-b border-[var(--line)] last:border-0">
                  <td className="p-4"><Link href={`/properties/${property._id}`} className="font-black text-[var(--brand)] hover:underline">{property.title}</Link></td>
                  <td className="p-4">{property.location}</td>
                  <td className="p-4"><Chip size="sm" variant="flat" className="capitalize">{property.propertyType}</Chip></td>
                  <td className="p-4 font-bold">${property.rent.toLocaleString()} <span className="font-normal text-[var(--muted)]">/ {{ monthly: "month", weekly: "week", daily: "day" }[property.rentType] || property.rentType || "month"}</span></td>
                  <td className="p-4"><Button size="sm" color="danger" variant="flat" onPress={() => setSelected(property)}><HeartOff size={15} />Remove</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-7 rounded-3xl border border-dashed border-[var(--line)] p-10 text-center">
          <h2 className="font-black">Nothing saved yet</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">Use the heart on a property detail page to save it here.</p>
          <Link className="mt-4 inline-block text-sm font-bold text-[var(--brand)]" href="/properties">Explore properties</Link>
        </div>
      )}
      <div className="mt-5 flex justify-center gap-3"><Button variant="flat" isDisabled={loading || pagination.page <= 1} onPress={() => setPage((old) => old - 1)}>Previous</Button><span className="py-2 text-sm font-bold">Page {pagination.page} of {pagination.pages}</span><Button variant="flat" isDisabled={loading || pagination.page >= pagination.pages} onPress={() => setPage((old) => old + 1)}>Next</Button></div>
      <Modal isOpen={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <ModalContent>{(onClose) => <>
          <ModalHeader>Remove saved property?</ModalHeader>
          <ModalBody><p className="text-sm text-[var(--muted)]">Remove <strong>{selected?.title}</strong> from your favorites? You can save it again anytime.</p></ModalBody>
          <ModalFooter><Button variant="light" onPress={onClose}>Keep it</Button><Button color="danger" isLoading={removing} onPress={remove}>Remove</Button></ModalFooter>
        </>}</ModalContent>
      </Modal>
    </div>
  );
}
