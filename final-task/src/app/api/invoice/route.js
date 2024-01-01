// Import the PrismaClient
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function setCorsHeaders(response) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  return response;
}

// Handle POST requests
export async function POST(req) {
  // Parse the JSON body of the request
  const body = await req.json();
  try {
    // Create a new invoice using the provided data
    const invoice = await prisma.invoice.create({
      data: body,
    });

    // Create a response with the created invoice and set CORS headers
    const response = new Response(JSON.stringify({
      success: true,
      invoice,
    }));
    return setCorsHeaders(response);
  } catch (error) {
    // Handle errors during invoice creation and create an error response
    console.error("Error creating invoice:", error);
    const response = new Response(JSON.stringify({
      success: false,
      error: "Error creating invoice.",
    }));
    return setCorsHeaders(response);
  }
}

// Handle GET requests
export async function GET() {
  try {
    // Fetch all invoices from the database using Prisma
    const invoices = await prisma.invoice.findMany();

    // Create a response with the fetched invoices and set CORS headers
    const response = new Response(JSON.stringify({
      success: true,
      invoices,
    }));
    return setCorsHeaders(response);
  } catch (error) {
    // Handle errors during invoice fetching and create an error response
    console.error("Error fetching invoices:", error);
    const response = new Response(JSON.stringify({
      success: false,
      error: "Error fetching invoices.",
    }));
    return setCorsHeaders(response);
  }
}
