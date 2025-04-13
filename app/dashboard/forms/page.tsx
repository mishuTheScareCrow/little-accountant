"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import LoanForm from "@/components/forms/AddLoanForm";
import AddExpenseForm from "@/components/forms/AddExpenseForm";
import BudgetForm from "@/components/forms/AddBudgetForm";
import SubscriptionForm from "@/components/forms/AddSubscriptionForm";

export default function FormTabsPage() {
  return (
    <main className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        Manage Your Finances
      </h1>

      <Tabs defaultValue="loan" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="loan">Loan</TabsTrigger>
          <TabsTrigger value="expense">Expense</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
        </TabsList>

        <TabsContent value="loan">
          <Card>
            <CardContent className="p-6">
              <LoanForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expense">
          <Card>
            <CardContent className="p-6">
              <AddExpenseForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget">
          <Card>
            <CardContent className="p-6">
              <BudgetForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscription">
          <Card>
            <CardContent className="p-6">
              <SubscriptionForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
