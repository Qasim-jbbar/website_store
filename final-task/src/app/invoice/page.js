// use client
import React, { useEffect, useState } from "react";
import { Table, Button } from "antd";
import jsPDF from "jspdf";
import "jspdf-autotable";
import AppContainer from "@/components/Contaner/container";
import Header from "@/components/Header/header";
import { Space } from "@/components/space/Space";

const Page = () => {
  const [list, setList] = useState([]);
  // State for loading indicator
  const [loading, setLoading] = useState(true);
  // State for tracking selected invoice
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Columns configuration for Ant Design Table
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Number",
      dataIndex: "number",
      key: "number",
    },
    {
      title: "Items",
      dataIndex: "items",
      key: "items",
      // Render function for displaying cart items
      render: (items) => {
        const cartItems = items?.cart?.map((cartItem) => cartItem.product.name).join(", ");
        return <div>{cartItems}</div>;
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      // Render function for action buttons
      render: (_, record) => (
        <Button onClick={() => handleExportPDF(record)}>Export to PDF</Button>
      ),
    },
  ];

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const url = `https://final-task-noaf.vercel.app/api/invoice`;
        const res = await fetch(url);

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const jsonData = await res.json();

        if (jsonData.success && Array.isArray(jsonData.invoices)) {
          const invoices = jsonData.invoices;
          // Format invoice data
          const formattedData = invoices.map((item) => ({
            ...item,
            items: typeof item.items === "string" ? JSON.parse(item.items) : item.items,
          }));

          setList(formattedData);
        } else {
          console.error("Invalid data format:", jsonData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle export button click
  const handleExportPDF = (invoice) => {
    setSelectedInvoice(invoice);
    exportToPDF(invoice);
  };

  // Generate and export PDF
  const exportToPDF = (invoice) => {
    const tableRef = document.getElementById("invoiceTable");

    // Extract data for the PDF table
    const dataPDF = list.map((item) => ({
      id: item.id,
      date: item.date,
      number: item.number,
      items: item.items?.cart?.map((cartItem) => cartItem.product.name).join(", ") || "",
    }));

    // Create the PDF document
    const pdf = new jsPDF();
    pdf.autoTable({
      head: [["ID", "Date", "Number", "Items"]],
      body: dataPDF.map((row) => [row.id, row.date, row.number, row.items]),
    });

    // Save PDF file
    pdf.save(`invoice_${invoice.id}.pdf`);
  };

  // Verification Comment: This code is used to generate and export invoices to PDF.

  return (
    <div>
      <Header />
      <AppContainer width={1300}>
        <Space height={20} />
        <Table
          id="invoiceTable"
          columns={columns}
          dataSource={list}
          loading={loading}
        />
      </AppContainer>
    </div>
  );
};

export default Page;
