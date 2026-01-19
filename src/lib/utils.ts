export function formatRupiah(value: number) {
  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value);

  return (
    sign +
    "Rp " +
    abs.toLocaleString("id-ID")
  );
}

export function formatTanggal(
  date: Date = new Date()
) {
  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

