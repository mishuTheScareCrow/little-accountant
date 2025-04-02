import { auth } from "@/auth";
import { prisma } from "@/database/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Overview } from "@/components/overview";
import { RecentExpenses } from "@/components/recent-expenses";
import { BudgetProgress } from "@/components/budget-progress";
import { UpcomingPayments } from "@/components/upcoming-payments";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const userId = session.user.id;

  // Get total expenses for the current month
  const currentDate = new Date();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  const totalExpenses = await prisma.expense.aggregate({
    where: {
      userId,
      date: {
        gte: firstDayOfMonth,
        lte: lastDayOfMonth,
      },
    },
    _sum: {
      amount: true,
    },
  });

  // Get total budget for the current month
  const totalBudget = await prisma.budget.aggregate({
    where: {
      userId,
      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear(),
    },
    _sum: {
      limitAmount: true,
    },
  });

  // Get upcoming subscriptions
  const upcomingSubscriptions = await prisma.subscription.findMany({
    where: {
      userId,
      nextBillingDate: {
        gte: currentDate,
        lte: new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000), // Next 30 days
      },
    },
    orderBy: {
      nextBillingDate: "asc",
    },
    take: 5,
  });

  // Get upcoming loan payments
  const upcomingLoans = await prisma.loan.findMany({
    where: {
      userId,
      dueDate: {
        gte: currentDate,
        lte: new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000), // Next 30 days
      },
    },
    orderBy: {
      dueDate: "asc",
    },
    take: 5,
  });

  // Get recent expenses
  const recentExpenses = await prisma.expense.findMany({
    where: {
      userId,
    },
    orderBy: {
      date: "desc",
    },
    take: 5,
  });

  // Get budgets for the current month
  const budgets = await prisma.budget.findMany({
    where: {
      userId,
      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear(),
    },
  });

  // Calculate expenses by category for the current month
  const expensesByCategory = await prisma.expense.groupBy({
    by: ["category"],
    where: {
      userId,
      date: {
        gte: firstDayOfMonth,
        lte: lastDayOfMonth,
      },
    },
    _sum: {
      amount: true,
    },
  });

  // Format data for the overview chart
  const overviewData = expensesByCategory.map((item) => ({
    name: item.category,
    total: item._sum.amount || 0,
  }));

  // Calculate upcoming payments
  const upcomingPayments = [
    ...upcomingSubscriptions.map((sub) => ({
      id: sub.id,
      name: sub.name,
      amount: sub.amount,
      date: sub.nextBillingDate,
      type: "subscription" as const,
    })),
    ...upcomingLoans.map((loan) => ({
      id: loan.id,
      name: loan.lender,
      amount: loan.amount,
      date: loan.dueDate,
      type: "loan" as const,
    })),
  ]
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalExpenses._sum.amount?.toFixed(2) || "0.00"}</div>
            <p className="text-xs text-muted-foreground">
              For {new Intl.DateTimeFormat("en-US", { month: "long" }).format(currentDate)} {currentDate.getFullYear()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBudget._sum.limitAmount?.toFixed(2) || "0.00"}</div>
            <p className="text-xs text-muted-foreground">
              For {new Intl.DateTimeFormat("en-US", { month: "long" }).format(currentDate)} {currentDate.getFullYear()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining Budget</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${((totalBudget._sum.limitAmount || 0) - (totalExpenses._sum.amount || 0)).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              For {new Intl.DateTimeFormat("en-US", { month: "long" }).format(currentDate)} {currentDate.getFullYear()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Usage</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalBudget._sum.limitAmount ? Math.round(((totalExpenses._sum.amount || 0) / totalBudget._sum.limitAmount) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              For {new Intl.DateTimeFormat("en-US", { month: "long" }).format(currentDate)} {currentDate.getFullYear()}
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>
              Your expense breakdown for {new Intl.DateTimeFormat("en-US", { month: "long" }).format(currentDate)}{" "}
              {currentDate.getFullYear()}
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview data={overviewData} />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Budget Progress</CardTitle>
            <CardDescription>Your budget usage by category</CardDescription>
          </CardHeader>
          <CardContent>
            <BudgetProgress budgets={budgets} />
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
            <CardDescription>Your most recent transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentExpenses expenses={recentExpenses} />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Upcoming Payments</CardTitle>
            <CardDescription>Your upcoming subscriptions and loan payments</CardDescription>
          </CardHeader>
          <CardContent>
            <UpcomingPayments payments={upcomingPayments} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
