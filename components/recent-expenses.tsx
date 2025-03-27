"use client";

import type { Expense } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";

interface RecentExpensesProps {
  expenses: Expense[];
}

export function RecentExpenses({ expenses }: RecentExpensesProps) {
  return (
    <div className="space-y-4">
      {expenses.length === 0 ? (
        <p className="text-sm text-muted-foreground">No recent expenses.</p>
      ) : (
        <div className="space-y-4">
          {expenses.map((expense) => (
            <div key={expense.id} className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{expense.description || expense.category}</p>
                <p className="text-sm text-muted-foreground">
                  {expense.category} • {formatDistanceToNow(new Date(expense.date), { addSuffix: true })}
                </p>
              </div>
              <div className="font-medium">${expense.amount.toFixed(2)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
