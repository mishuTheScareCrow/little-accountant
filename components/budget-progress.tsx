"use client";

import { budgets } from "@/database/schema";
import { Progress } from "@/components/ui/progress";

interface BudgetProgressProps {
  budgets: (typeof budgets.$inferSelect)[];
}

export function BudgetProgress({ budgets }: BudgetProgressProps) {
  return (
    <div className="space-y-4">
      {budgets.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No budgets set for this month.
        </p>
      ) : (
        budgets.map((budget) => {
          const percentage = Math.min(
            Math.round(
              (budget.currentSpend / budget.limitAmount) * 100
            ),
            100
          );
          return (
            <div key={budget.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {budget.category}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  ${budget.currentSpend.toFixed(2)} / $
                  {budget.limitAmount.toFixed(2)}
                </span>
              </div>
              <Progress value={percentage} className="h-2" />
              <p className="text-xs text-muted-foreground text-right">
                {percentage}% used
              </p>
            </div>
          );
        })
      )}
    </div>
  );
}
