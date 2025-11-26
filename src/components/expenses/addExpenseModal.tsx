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
import { useTranslation } from "react-i18next";
import { useSettings } from "../../stores/settingsStore";
import { Label } from "../ui/label.tsx";

export function AddExpenseModal() {
  const { t } = useTranslation();
  const { categories } = useSettings();

  type FormData = z.infer<typeof expenseSchema>;
  const expenseSchema = z.object({
    label: z.string().min(1, t("required")),
    amount: z.number().positive(t("invalidAmount")),
    category: z.string().min(1, t("required")),
    date: z.date(),
  });

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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 cursor-pointer">
          <Plus size={18} />
          {t("addExpenseModal.addButton")}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("addExpenseModal.title")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
          {/* LABEL */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="label" className="text-sm font-medium">
              {t("addExpenseModal.label")}
            </Label>
            <Input
              id="label"
              {...form.register("label")}
              placeholder="e.g., Grocery"
            />
          </div>

          {/* AMOUNT */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="amount" className="text-sm font-medium">
              {t("addExpenseModal.amount")} (€)
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              {...form.register("amount", { valueAsNumber: true })}
              placeholder="e.g., 12.50"
            />
          </div>

          {/* CATEGORY */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="category" className="text-sm font-medium">
              {t("addExpenseModal.category")}
            </Label>

            <Select
              value={form.watch("category")}
              onValueChange={(v) =>
                form.setValue("category", v, { shouldValidate: true })
              }
            >
              <SelectTrigger
                id="category"
                aria-label={t("addExpenseModal.category")}
              >
                <SelectValue
                  placeholder={t("addExpenseModal.selectCategoryPlaceholder")}
                />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* DATE PICKER */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="date" className="text-sm font-medium">
              {t("addExpenseModal.date")}
            </Label>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant="outline"
                  className="w-full justify-between"
                  aria-label={t("addExpenseModal.date")}
                >
                  {form.watch("date")
                    ? format(form.watch("date"), "PPP")
                    : t("datePicker.placeholder")}
                  <CalendarIcon className="h-4 w-4 opacity-70" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="p-0">
                <Calendar
                  aria-label={t("addExpenseModal.date")}
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
            {t("addExpenseModal.addButton")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
