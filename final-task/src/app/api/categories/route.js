// Import the PrismaClient
import { PrismaClient } from "@prisma/client";
t
const prisma = new PrismaClient();

function setCorsHeaders(response) {
  // Set CORS headers to allow requests from any origin
  response.headers.set("Access-Control-Allow-Origin", "*"); 
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return response;
}

export async function GET(req) {
  // Extract query parameters from the request URL
  const searchParams = req.nextUrl.searchParams;
  const cat = searchParams.get("cat");
  const query = searchParams.get("query");

  // Define an empty where clause for Prisma filtering
  let whereClause = {};

  // If a query parameter is present, filter by product name
  if (query) {
    whereClause = {
      name: {
        contains: query,
      },
    };
  }

  try {
    // Fetch products based on the provided filters using Prisma
    let products = await prisma.category.findMany({
      where: cat
        ? {
            categoryId: parseInt(cat),
            ...whereClause,
          }
        : whereClause,
      orderBy: {
        id: "asc",
      },
    });

    // Create a response with the fetched products and set CORS headers
    const response = new Response(JSON.stringify(products));
    return setCorsHeaders(response);
  } catch (error) {
    // Handle errors during product fetching and create an error response
    console.error("Error fetching products:", error);
    const response = new Response(
      JSON.stringify({
        success: false,
        error: "Error fetching products.",
      })
    );
    return setCorsHeaders(response);
  }
}

// Handle POST requests
export async function POST({ json: body }) {
  try {
    // Create a new category using the provided data
    let category = await prisma.category.create({
      data: body,
    });

    // Create a response with the created category and set CORS headers
    const response = new Response(
      JSON.stringify({
        success: true,
        category,
      })
    );
    return setCorsHeaders(response);
  } catch (error) {
    // Handle errors during category creation and create an error response
    console.error("Error creating category:", error);
    const response = new Response(
      JSON.stringify({
        success: false,
        error: "Error creating category.",
      })
    );
    return setCorsHeaders(response);
  }
}
