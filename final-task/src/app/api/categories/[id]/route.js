import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function setCorsHeaders(response) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "PUT, DELETE, OPTIONS");
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  return response;
}

export async function PUT(req, { params }) {
  const { id } = params;
  const body = await req.json();
  try {
    let category = await prisma.category.update({
      where: {
        id: parseInt(id),
      },
      data: body,
    });

    const response = new Response(
      JSON.stringify({
        success: true,
        category,
      })
    );
    return setCorsHeaders(response);
  } catch (error) {
    const response = new Response(
      JSON.stringify({
        success: false,
        error,
      })
    );
    return setCorsHeaders(response);
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;
  try {
    const productsInCategory = await prisma.product.findMany({
      where: {
        categoryId: parseInt(id),
      },
    });

    if (productsInCategory.length > 0) {
      const response = new Response(
        JSON.stringify({
          success: false,
          error: "Cannot delete category with associated products.",
        })
      );
      return setCorsHeaders(response);
    }

    const deletedCategory = await prisma.category.delete({
      where: {
        id: parseInt(id),
      },
    });

    const response = new Response(
      JSON.stringify({
        success: true,
        category: deletedCategory,
      })
    );
    return setCorsHeaders(response);
  } catch (error) {
    const response = new Response(
      JSON.stringify({
        success: false,
        error,
      })
    );
    return setCorsHeaders(response);
  }
}
