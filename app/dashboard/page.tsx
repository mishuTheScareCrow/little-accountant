import { auth } from "@/auth";
import { db } from "@/database/drizzle"; // Drizzle DB instance
import {
  expenses,
  budgets,
  subscriptions,
  loans,
} from "@/database/schema"; // Table schemas
import { eq, and, gte, lte, sql } from "drizzle-orm";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Overview } from "@/components/overview";
import { RecentExpenses } from "@/components/recent-expenses";
import { BudgetProgress } from "@/components/budget-progress";
import { UpcomingPayments } from "@/components/upcoming-payments";
import { Badge } from "@/components/ui/badge";
import { TrendingUpIcon } from "lucide-react";
import SpendingSummaryCard from "@/components/spending-summary";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const userId = session.user.id;
  const currentDate = new Date();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  // Total expenses for the current month
  const totalExpenses = await db
    .select({ amount: sql<number>`SUM(amount)` })
    .from(expenses)
    .where(
      and(
        eq(expenses.userId, userId),
        gte(expenses.date, firstDayOfMonth),
        lte(expenses.date, lastDayOfMonth)
      )
    );

  // Total budget for the current month (using the correct column name)
  const totalBudget = await db
    .select({ limitAmount: sql<number>`SUM("limit_amount")` })
    .from(budgets)
    .where(
      and(
        eq(budgets.userId, userId),
        eq(budgets.month, currentDate.getMonth() + 1),
        eq(budgets.year, currentDate.getFullYear())
      )
    );

  // Upcoming subscriptions (next 30 days)
  const upcomingSubscriptions = await db
    .select()
    .from(subscriptions)
    .where(
      and(
        eq(subscriptions.userId, userId),
        gte(subscriptions.nextBillingDate, currentDate),
        lte(
          subscriptions.nextBillingDate,
          new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000)
        )
      )
    )
    .orderBy(subscriptions.nextBillingDate)
    .limit(5);

  // Upcoming loans (next 30 days)
  const upcomingLoans = await db
    .select()
    .from(loans)
    .where(
      and(
        eq(loans.userId, userId),
        gte(loans.dueDate, currentDate),
        lte(
          loans.dueDate,
          new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000)
        )
      )
    )
    .orderBy(loans.dueDate)
    .limit(5);

  // Recent expenses (latest 5)
  const recentExpenses = await db
    .select()
    .from(expenses)
    .where(eq(expenses.userId, userId))
    .orderBy(sql`date DESC`)
    .limit(5);

  // Budgets for the current month
  const budgetsForMonth = await db
    .select()
    .from(budgets)
    .where(
      and(
        eq(budgets.userId, userId),
        eq(budgets.month, currentDate.getMonth() + 1),
        eq(budgets.year, currentDate.getFullYear())
      )
    );

  // Expenses aggregated by category for overview
  const expensesByCategory = await db
    .select({
      category: expenses.category,
      total: sql<number>`SUM(amount)`,
    })
    .from(expenses)
    .where(
      and(
        eq(expenses.userId, userId),
        gte(expenses.date, firstDayOfMonth),
        lte(expenses.date, lastDayOfMonth)
      )
    )
    .groupBy(expenses.category);

  const overviewData = expensesByCategory.map((item) => ({
    name: item.category,
    total: item.total || 0,
  }));

  // Combine upcoming subscriptions and loans into a single payments list
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
    <div className="flex flex-col gap-4 p-4">
      {/* Top cards: Expenses, Budget, Remaining, and Usage */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SpendingSummaryCard />

        <Card className="gap-4">
          <CardHeader className="relative">
            <CardTitle className="font-normal">
              Total Expenses
            </CardTitle>
            <div className="absolute right-4 top-0">
              <Badge
                variant="outline"
                className="flex gap-1 rounded-lg text-xs"
              >
                <TrendingUpIcon className="size-3" />
                +12.5%
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">
              $
              {totalExpenses[0]?.amount
                ? totalExpenses[0].amount.toFixed(2)
                : "0.00"}
            </div>
          </CardContent>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="text-muted-foreground">
              Increased +12.5% than last month
            </div>
          </CardFooter>
        </Card>

        <Card className="gap-4">
          <CardHeader className="relative">
            <CardTitle className="font-normal">
              <p>Total Budget</p>
              <div className="absolute right-4 top-0">
                <Badge
                  variant="outline"
                  className="flex gap-1 rounded-lg text-xs"
                >
                  <TrendingUpIcon className="size-3" />
                  +12.5%
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">
              $
              {totalBudget[0]?.limitAmount
                ? totalBudget[0].limitAmount.toFixed(2)
                : "0.00"}
            </div>
          </CardContent>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="text-muted-foreground">
              Increased +12.5% than last month
            </div>
          </CardFooter>
        </Card>

        <Card className="gap-4">
          <CardHeader className="relative">
            <CardTitle className="font-normal">
              <p>Remaining Budget</p>
              <div className="absolute right-4 top-0">
                <Badge
                  variant="outline"
                  className="flex gap-1 rounded-lg text-xs"
                >
                  <TrendingUpIcon className="size-3" />
                  +12.5%
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">
              $
              {(
                (totalBudget[0]?.limitAmount || 0) -
                (totalExpenses[0]?.amount || 0)
              ).toFixed(2)}
            </div>
          </CardContent>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="text-muted-foreground">
              Increased +12.5% than last month
            </div>
          </CardFooter>
        </Card>

        <Card className="gap-4">
          <CardHeader className="relative">
            <CardTitle className="font-normal">
              <p>Budget Budget</p>
              <div className="absolute right-4 top-0">
                <Badge
                  variant="outline"
                  className="flex gap-1 rounded-lg text-xs"
                >
                  <TrendingUpIcon className="size-3" />
                  +12.5%
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">
              {totalBudget[0]?.limitAmount
                ? Math.round(
                    ((totalExpenses[0]?.amount || 0) /
                      totalBudget[0].limitAmount) *
                      100
                  )
                : 0}
              %
            </div>
          </CardContent>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="text-muted-foreground">
              Increased +12.5% than last month
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Middle section: Overview and Budget Progress */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Overview data={overviewData} />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Budget Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <BudgetProgress budgets={budgetsForMonth} />
          </CardContent>
        </Card>
      </div>

      {/* Bottom section: Recent Expenses and Upcoming Payments */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentExpenses expenses={recentExpenses} />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Upcoming Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <UpcomingPayments payments={upcomingPayments} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
