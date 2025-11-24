import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/ui/select";
import { Calendar } from "../../components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../../components/ui/popover";
import { useExpenseActions } from "../../stores/expenseStore.ts";
import { format } from "date-fns";
import { CalendarIcon, Plus } from "lucide-react";

const expenseSchema = z.object({
  label: z.string().min(1, "Required"),
  amount: z.number().positive("Amount must be greater than 0"),
  category: z.string().min(1, "Required"),
  date: z.date(),
});

type FormData = z.infer<typeof expenseSchema>;

export function AddExpenseModal() {
  const [open, setOpen] = useState(false);
  const { addExpense } = useExpenseActions();

  const form = useForm<FormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      label: "",
      amount: 0,
      category: "",
      date: new Date(),
    },
  });

  const onSubmit = (data: FormData) => {
    addExpense({
      label: data.label,
      amount: data.amount,
      category: data.category,
      date: data.date.toISOString().split("T")[0],
    });

    setOpen(false);
    form.reset();
  };

  console.log("useExpenseActions:", useExpenseActions);


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus size={18} />
          Add Expense
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
          {/* LABEL */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Label</label>
            <Input {...form.register("label")} placeholder="e.g., Grocery" />
          </div>

          {/* AMOUNT */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Amount (€)</label>
            <Input
              type="number"
              step="0.01"
              {...form.register("amount", { valueAsNumber: true })}
              placeholder="e.g., 12.50"
            />
          </div>

          {/* CATEGORY */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Category</label>

            <Select
              value={form.watch("category")}
              onValueChange={(v) =>
                form.setValue("category", v, { shouldValidate: true })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Food">Food</SelectItem>
                <SelectItem value="Transport">Transport</SelectItem>
                <SelectItem value="Shopping">Shopping</SelectItem>
                <SelectItem value="Bills">Bills</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* DATE PICKER */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Date</label>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {form.watch("date")
                    ? format(form.watch("date"), "PPP")
                    : "Pick a date"}
                  <CalendarIcon className="h-4 w-4 opacity-70" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="p-0">
                <Calendar
                  mode="single"
                  selected={form.watch("date")}
                  onSelect={(d) =>
                    d && form.setValue("date", d, { shouldValidate: true })
                  }
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button type="submit" className="w-full">
            Save Expense
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
