"use client";

import { useState } from "react";
import { FileText, Loader2 } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default function DownloadReportButton() {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        try {
            setIsDownloading(true);
            const response = await fetch("/api/admin/reports/sales");

            if (!response.ok) {
                throw new Error("Failed to generate report");
            }

            const data = await response.json();

            // Initialize PDF
            const doc = new jsPDF();
            const timestamp = new Date().toLocaleDateString();

            // Add Branding/Header
            doc.setFillColor(79, 70, 229); // Indigo-600
            doc.rect(0, 0, 210, 40, 'F');

            doc.setTextColor(255, 255, 255);
            doc.setFontSize(24);
            doc.setFont("helvetica", "bold");
            doc.text("SALES ANALYTICS REPORT", 20, 25);

            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text(`Generated on: ${timestamp}`, 20, 32);

            // Summary Section
            doc.setTextColor(30, 41, 59); // Slate-800
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.text("Executive Summary", 20, 55);

            doc.setFontSize(11);
            doc.setFont("helvetica", "normal");
            doc.text(`Total Revenue: $${data.totalRevenue.toLocaleString()}`, 20, 65);
            doc.text(`Total Orders: ${data.totalOrders}`, 20, 72);
            doc.text(`Average Order Value: $${(data.totalRevenue / data.totalOrders || 0).toFixed(2)}`, 20, 79);

            // Table Section
            const tableHeaders = [["Order ID", "Date", "Customer", "Amount", "Status"]];
            const tableData = data.orders.map((o: any) => [
                o.id.slice(-8).toUpperCase(),
                o.date,
                o.customerName,
                `$${o.amount.toFixed(2)}`,
                o.status
            ]);

            autoTable(doc, {
                startY: 90,
                head: tableHeaders,
                body: tableData,
                theme: 'striped',
                headStyles: {
                    fillColor: [79, 70, 229],
                    textColor: 255,
                    fontSize: 10,
                    fontStyle: 'bold',
                    cellPadding: 5
                },
                bodyStyles: {
                    fontSize: 9,
                    cellPadding: 4
                },
                alternateRowStyles: {
                    fillColor: [248, 250, 252]
                },
                margin: { left: 20, right: 20 }
            });

            // Footer
            const pageCount = (doc as any).internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(10);
                doc.setTextColor(148, 163, 184); // Slate-400
                doc.text(
                    `Page ${i} of ${pageCount}`,
                    doc.internal.pageSize.width / 2,
                    doc.internal.pageSize.height - 10,
                    { align: "center" }
                );
            }

            // Save PDF
            doc.save(`sales-report-${new Date().toISOString().split('T')[0]}.pdf`);

        } catch (error) {
            console.error("DOWNLOAD_ERROR", error);
            alert("Failed to generate PDF report. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="group px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-black text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isDownloading ? (
                <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
            ) : (
                <FileText className="w-4 h-4 text-indigo-500 group-hover:scale-110 transition-transform" />
            )}
            {isDownloading ? "Generating PDF..." : "Export to PDF"}
        </button>
    );
}
