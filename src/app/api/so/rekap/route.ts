import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/* =====================================================
   GET /api/so/rekap
   Rekap per lembar + grand total
===================================================== */
export async function GET(req: NextRequest) {
  try {
    // AUTH (dari middleware)
    const userId = req.headers.get("x-user-id");
    const userRole = req.headers.get("x-user-role");

    if (!userId || !userRole) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Ambil semua data SO
    const data = await prisma.so_detail.findMany({
      select: {
        lembar: true,
        selisih_nilai: true,
      },
    });

    // Group by lembar
    const rekapMap = new Map<number, number>();

    for (const item of data) {
      const current = rekapMap.get(item.lembar) ?? 0;
      rekapMap.set(item.lembar, current + item.selisih_nilai);
    }

    // Ubah ke array
    const rekap = Array.from(rekapMap.entries())
      .map(([lembar, total_selisih]) => ({
        lembar,
        total_selisih,
      }))
      .sort((a, b) => a.lembar - b.lembar);

    // Grand total
    const grand_total = rekap.reduce(
      (sum, item) => sum + item.total_selisih,
      0
    );

    return NextResponse.json({
      success: true,
      rekap,
      grand_total,
    });
  } catch (error) {
    console.error("GET /api/so/rekap error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
