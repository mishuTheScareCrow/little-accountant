"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { number, z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner"; // Use ShadCN's toast or similar
import { createBudgetSchema } from "@/lib/validators/budget"; // Import the schema
// Import DatePicker if using ShadCN's version
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

type FormData = z.infer<typeof createBudgetSchema>;

export default function AddBudgetForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const form = useForm<FormData>({
    resolver: zodResolver(createBudgetSchema),
    defaultValues: {
      limitAmount: undefined,
      currentSpend: undefined,
      category: "",
      month: new Date().getMonth(), // Default to current month
      year: new Date().getFullYear(), // Default to current year
    },
  });

  async function onSubmit(values: FormData) {
    try {
      const response = await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          // Ensure date is sent in a format the backend expects (ISO string is good)
          date: values.date.toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add budget");
      }

      toast.success(`Budget added successfully!`);
      form.reset();
      onSuccess?.(); // Callback for refreshing data on parent component
      // Consider using router.refresh() if not using callback
    } catch (error: any) {
      console.error("Form submission error:", error);
      toast.error(error.message || "An error occurred.");
    }
  }

  return (
    // Use ShadCN Form component for structure and accessibility
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        {/* Amount Field */}
        <FormField
          control={form.control}
          name="limitAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Current Spend Field */}
        <FormField
          control={form.control}
          name="currentSpend"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Spend</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category Field */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                {/* Consider using a Select component for predefined categories */}
                <Input
                  placeholder="e.g., Food, Transport"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date Field */}
        <FormField
          control={form.control}
          name="month"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Month</FormLabel>
              {/* Basic HTML5 date picker */}
              {/* <FormControl>
                <Input
                  type="date"
                  value={
                    field.value instanceof Date
                      ? field.value.toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    field.onChange(e.target.valueAsDate ?? new Date())
                  }
                />
              </FormControl> */}
              {/* Or use ShadCN Calendar component */}

              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() ||
                      date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Adding..." : "Add Budget"}
        </Button>
      </form>
    </Form>
  );
}
