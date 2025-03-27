"use client";

import { formatDistanceToNow } from "date-fns";

interface Payment {
  id: string;
  name: string;
  amount: number;
  date: Date;
  type: "subscription" | "loan";
}

interface UpcomingPaymentsProps {
  payments: Payment[];
}

export function UpcomingPayments({ payments }: UpcomingPaymentsProps) {
  return (
    <div className="space-y-4">
      {payments.length === 0 ? (
        <p className="text-sm text-muted-foreground">No upcoming payments.</p>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => (
            <div key={payment.id} className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{payment.name}</p>
                <p className="text-sm text-muted-foreground">
                  {payment.type === "subscription" ? "Subscription" : "Loan"} •{" "}
                  {formatDistanceToNow(new Date(payment.date), { addSuffix: true })}
                </p>
              </div>
              <div className="font-medium">${payment.amount.toFixed(2)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
