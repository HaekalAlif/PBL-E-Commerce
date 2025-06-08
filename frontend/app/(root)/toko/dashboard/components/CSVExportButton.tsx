"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { AnalyticsData } from "../types";

interface CSVExportButtonProps {
  analytics: AnalyticsData;
  dateRange: { start_date: string; end_date: string };
}

export function CSVExportButton({
  analytics,
  dateRange,
}: CSVExportButtonProps) {
  const [loading, setLoading] = useState(false);

  const downloadCSV = (data: string, filename: string) => {
    const blob = new Blob([data], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const generateOverviewCSV = () => {
    const headers = ["Metrik", "Nilai", "Pertumbuhan (%)"];
    const rows = [
      [
        "Total Pendapatan",
        analytics.overview.total_revenue.toString(),
        analytics.overview.revenue_growth.toString(),
      ],
      [
        "Total Pesanan",
        analytics.overview.total_orders.toString(),
        analytics.overview.orders_growth.toString(),
      ],
      ["Total Produk", analytics.overview.total_products.toString(), ""],
      ["Saldo Tersedia", analytics.overview.available_balance.toString(), ""],
    ];

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const filename = `ringkasan-toko-${formatDate(new Date())}.csv`;
    downloadCSV(csvContent, filename);
  };

  const generateSalesTrendCSV = () => {
    const headers = ["Tanggal", "Pendapatan", "Jumlah Pesanan"];
    const rows = analytics.sales_trend.map((item) => [
      item.date,
      item.revenue.toString(),
      item.orders.toString(),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const filename = `tren-penjualan-${formatDate(new Date())}.csv`;
    downloadCSV(csvContent, filename);
  };

  const generateOrderStatusCSV = () => {
    const headers = ["Status", "Jumlah Pesanan"];
    const rows = analytics.order_status_distribution.map((item) => [
      item.status,
      item.count.toString(),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const filename = `status-pesanan-${formatDate(new Date())}.csv`;
    downloadCSV(csvContent, filename);
  };

  const generateCustomerAnalyticsCSV = () => {
    const headers = ["Metrik", "Nilai"];
    const rows = [
      [
        "Pelanggan Unik",
        analytics.customer_analytics.unique_customers.toString(),
      ],
      [
        "Pelanggan Berulang",
        analytics.customer_analytics.repeat_customers.toString(),
      ],
      [
        "Tingkat Retensi (%)",
        analytics.customer_analytics.retention_rate.toString(),
      ],
    ];

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const filename = `analisis-pelanggan-${formatDate(new Date())}.csv`;
    downloadCSV(csvContent, filename);
  };

  const generateRecentActivitiesCSV = () => {
    const headers = ["Tanggal", "Aktivitas", "Produk", "Jumlah", "Status"];
    const rows = analytics.recent_activities.map((activity) => [
      new Date(activity.created_at).toLocaleDateString("id-ID"),
      activity.message,
      activity.product,
      activity.amount.toString(),
      activity.status,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const filename = `aktivitas-terbaru-${formatDate(new Date())}.csv`;
    downloadCSV(csvContent, filename);
  };

  const generateCompleteReport = async () => {
    setLoading(true);
    try {
      // Generate a comprehensive report
      const reportSections = [
        "=== LAPORAN ANALITIK TOKO ===",
        `Periode: ${dateRange.start_date} sampai ${dateRange.end_date}`,
        `Tanggal Ekspor: ${formatDate(new Date())}`,
        "",
        "=== RINGKASAN UMUM ===",
        `Total Pendapatan,${analytics.overview.total_revenue}`,
        `Pertumbuhan Pendapatan (%),${analytics.overview.revenue_growth}`,
        `Total Pesanan,${analytics.overview.total_orders}`,
        `Pertumbuhan Pesanan (%),${analytics.overview.orders_growth}`,
        `Total Produk,${analytics.overview.total_products}`,
        `Saldo Tersedia,${analytics.overview.available_balance}`,
        "",
        "=== PERFORMA PRODUK ===",
        `Total Produk,${analytics.product_performance.total_products}`,
        `Produk Terjual,${analytics.product_performance.sold_products}`,
        `Tingkat Konversi (%),${analytics.product_performance.conversion_rate}`,
        `Rating Rata-rata,${analytics.product_performance.average_rating}`,
        "",
        "=== ANALISIS PELANGGAN ===",
        `Pelanggan Unik,${analytics.customer_analytics.unique_customers}`,
        `Pelanggan Berulang,${analytics.customer_analytics.repeat_customers}`,
        `Tingkat Retensi (%),${analytics.customer_analytics.retention_rate}`,
        "",
        "=== DISTRIBUSI STATUS PESANAN ===",
        "Status,Jumlah",
        ...analytics.order_status_distribution.map(
          (item) => `${item.status},${item.count}`
        ),
        "",
        "=== TREN PENJUALAN HARIAN ===",
        "Tanggal,Pendapatan,Pesanan",
        ...analytics.sales_trend.map(
          (item) => `${item.date},${item.revenue},${item.orders}`
        ),
      ];

      const csvContent = reportSections.join("\n");
      const filename = `laporan-lengkap-toko-${formatDate(new Date())}.csv`;
      downloadCSV(csvContent, filename);

      toast.success("Laporan lengkap berhasil diunduh");
    } catch (error) {
      toast.error("Gagal mengunduh laporan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-orange-300 text-orange-700 hover:bg-orange-50"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          Ekspor CSV
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 border-orange-200">
        <DropdownMenuItem onClick={generateCompleteReport}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Laporan Lengkap
        </DropdownMenuItem>
        <DropdownMenuItem onClick={generateOverviewCSV}>
          <Download className="h-4 w-4 mr-2" />
          Ringkasan Umum
        </DropdownMenuItem>
        <DropdownMenuItem onClick={generateSalesTrendCSV}>
          <Download className="h-4 w-4 mr-2" />
          Tren Penjualan
        </DropdownMenuItem>
        <DropdownMenuItem onClick={generateOrderStatusCSV}>
          <Download className="h-4 w-4 mr-2" />
          Status Pesanan
        </DropdownMenuItem>
        <DropdownMenuItem onClick={generateCustomerAnalyticsCSV}>
          <Download className="h-4 w-4 mr-2" />
          Analisis Pelanggan
        </DropdownMenuItem>
        <DropdownMenuItem onClick={generateRecentActivitiesCSV}>
          <Download className="h-4 w-4 mr-2" />
          Aktivitas Terbaru
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
