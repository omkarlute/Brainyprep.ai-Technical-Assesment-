"use client";

import React, { useEffect } from "react";
import "@/app/styles/neon-theme.css";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Basic validation for a “send transaction” form.
 */
const formSchema = z.object({
  toAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, {
      message: "Enter a valid Ethereum address (0x + 40 hex chars)",
    }),

  amount: z.string().refine((value) => {
    const n = Number(value);
    return !isNaN(n) && n > 0;
  }, "Amount must be a positive number"),

  gasLimit: z.string().optional(),
  gasPrice: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  onClose: () => void;
  onCreated: (tx: any | null) => void;
  onToast: (msg: string, type?: "success" | "error") => void;
  apiCreate?: (payload: any) => Promise<any>;
}

const DRAFT_KEY = "txDraft:v1";

export function CreateTransactionForm({
  onClose,
  onCreated,
  onToast,
  apiCreate,
}: Props) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      toAddress: "",
      amount: "",
      gasLimit: "21000",
      gasPrice: "0.00000002",
    },
  });

  /**
   * Load any previous draft the user may have left unfinished.
   * This is only stored locally — nothing hits the backend until submit.
   */
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (!saved) return;

      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === "object") {
        for (const [key, val] of Object.entries(parsed)) {
          // loose assign is fine — keys match our form fields
          // @ts-ignore
          setValue(key, val);
        }
      }
    } catch {

    }
  }, [setValue]);

  /**
   * Persist draft changes in case the user closes the modal by accident.
   */
  useEffect(() => {
    const sub = watch((values) => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(values));
      } catch {
   
      }
    });
    return () => sub.unsubscribe();
  }, [watch]);

  // simple fee preview (gasLimit * gasPrice)
  const limit = Number(watch("gasLimit") || 21000);
  const price = Number(watch("gasPrice") || 0.00000002);
  const estimatedFee = limit * price;

  /**
   * Main submit handler.
  
   */
  const submitHandler = async (vals: FormValues) => {
    const payload = {
      toAddress: vals.toAddress,
      amount: vals.amount,
      gasLimit: vals.gasLimit || "21000",
      gasPrice: vals.gasPrice || "0.00000002",
    };

    try {
      let response;

      if (apiCreate) {
        // injected API impl (usually provided by parent)
        response = await apiCreate(payload);
      } else {
        // local fallback API
        const r = await fetch("/api/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        response = await r.json();
      }

      const data = response?.data ?? response;
      const created = Array.isArray(data) ? data[0] : data;

      onToast(`Created tx ${created?.hash ?? ""}`, "success");

      // once submitted successfully, clear draft + reset form
      localStorage.removeItem(DRAFT_KEY);
      reset();

      onCreated(created ?? null);
      onClose();
    } catch (err: any) {
      console.error("transaction create error", err);
      onToast(err?.message ?? "Could not create transaction", "error");
    }
  };

  return (
    <div className="glass-card neon-border rounded-2xl w-full md:w-[600px] max-h-[90vh] overflow-auto p-6 bg-white/70 dark:bg-slate-900/70">
      {/* Title Bar */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-300 bg-clip-text text-transparent">
          New Transaction
        </h3>
        <p className="text-xs opacity-70">Draft saved locally</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">

        {/* To Address */}
        <div>
          <Label className="font-semibold">To Address</Label>
          <Input
            {...register("toAddress")}
            placeholder="0x..."
            className="glass-card border dark:border-cyan-500/30"
          />
          {formState.errors.toAddress && (
            <p className="text-xs text-red-500 mt-1">
              {formState.errors.toAddress.message}
            </p>
          )}
        </div>

        {/* Amount */}
        <div>
          <Label className="font-semibold">Amount (ETH)</Label>
          <Input
            {...register("amount")}
            placeholder="1.23"
            className="glass-card border dark:border-cyan-500/30"
          />
          {formState.errors.amount && (
            <p className="text-xs text-red-500 mt-1">
              {formState.errors.amount.message}
            </p>
          )}
        </div>

        {/* Gas settings */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="font-semibold">Gas Limit</Label>
            <Input
              {...register("gasLimit")}
              className="glass-card border dark:border-cyan-500/30"
            />
          </div>

          <div>
            <Label className="font-semibold">Gas Price</Label>
            <Input
              {...register("gasPrice")}
              className="glass-card border dark:border-cyan-500/30"
            />
          </div>
        </div>

        {/* Fee estimate */}
        <div>
          <Label className="font-semibold">Estimated Fee</Label>
          <div className="text-sm opacity-70">
            {estimatedFee.toLocaleString(undefined, { maximumFractionDigits: 12 })} (units)
          </div>
        </div>

        {/* Form actions */}
        <div className="flex gap-3 pt-3">

          <Button
            type="submit"
            disabled={!formState.isValid || formState.isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 font-bold"
          >
            {formState.isSubmitting ? "Submitting…" : "Create Transaction"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => {
              reset();
              localStorage.removeItem(DRAFT_KEY);
            }}
            className="glass-card"
          >
            Clear Draft
          </Button>

          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>

        </div>
      </form>
    </div>
  );
}
