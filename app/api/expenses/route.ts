// src/app/api/expenses/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth"; // Your updated auth config
import { db } from "@/database/drizzle"; // Your Drizzle instance
import { expenses } from "@/database/schema"; // Your Drizzle schema table
import { createExpenseSchema } from "@/lib/validators/expense"; // Your Zod schema
import { ZodError } from "zod";

// GET /api/expenses (Fetch expenses - you'll need this too)
export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  try {
    const userExpenses = await db.query.expenses.findMany({
      where: (expenses, { eq }) =>
        eq(expenses.userId, session.user.id),
      orderBy: (expenses, { desc }) => [desc(expenses.date)],
    });
    return NextResponse.json(userExpenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return NextResponse.json(
      { error: "Failed to fetch expenses" },
      { status: 500 }
    );
  }
}

// POST /api/expenses (Create expense)
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const validation = createExpenseSchema.parse(body); // Use parse to throw ZodError on failure

    const [newExpense] = await db
      .insert(expenses)
      .values({
        userId: session.user.id,
        amount: validation.amount,
        category: validation.category,
        description: validation.description,
        date: validation.date,
        // createdAt/updatedAt are handled by DB defaults/triggers
      })
      .returning(); // Return the newly created record

    return NextResponse.json(newExpense, { status: 201 });
  } catch (error) {
    console.error("Error creating expense:", error);
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.flatten() },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create expense" },
      { status: 500 }
    );
  }
}
