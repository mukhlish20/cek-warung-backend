import { db } from "@/lib/dexie";

export async function syncBarangFromBackend() {
  const token = localStorage.getItem("token");

  const res = await fetch("/api/barang", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const json = await res.json();

  if (!json.success || !Array.isArray(json.data)) {
    throw new Error("Gagal sync barang");
  }

  const backendItems = json.data;

  await db.transaction("rw", db.barang, async () => {
    for (const item of backendItems) {
      const local = await db.barang.get(item.id);

      if (
        !local ||
        new Date(item.updatedAt) > new Date(local.updatedAt)
      ) {
        await db.barang.put({
          ...item,
        });
      }
    }
  });

  return backendItems.length;
}
