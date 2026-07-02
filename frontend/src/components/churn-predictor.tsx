import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { usePredictChurn } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle2 } from "lucide-react";

const predictionSchema = z.object({
  tenure: z.coerce.number().min(0).max(120),
  monthlyCharges: z.coerce.number().min(0).max(500),
  totalCharges: z.coerce.number().min(0).max(10000),
  seniorCitizen: z.coerce.number().min(0).max(1),
  contract: z.coerce.number().min(0).max(2),
});

export function ChurnPredictor() {
  const predictMutation = usePredictChurn();
  const [result, setResult] = useState<{ probability: number; label: string } | null>(null);

  const form = useForm<z.infer<typeof predictionSchema>>({
    resolver: zodResolver(predictionSchema),
    defaultValues: {
      tenure: 12,
      monthlyCharges: 50,
      totalCharges: 600,
      seniorCitizen: 0,
      contract: 0,
    },
  });

  function onSubmit(values: z.infer<typeof predictionSchema>) {
    predictMutation.mutate(
      { data: values },
      {
        onSuccess: (res) => {
          setResult({
            probability: res.churnProbability,
            label: res.label,
          });
        },
      }
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Predictor</CardTitle>
        <CardDescription>Enter customer details to calculate real-time churn probability.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tenure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tenure (Months)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contract"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contract Type</FormLabel>
                    <Select onValueChange={(val) => field.onChange(parseInt(val))} value={field.value.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select contract" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0">Month-to-month</SelectItem>
                        <SelectItem value="1">One year</SelectItem>
                        <SelectItem value="2">Two year</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="monthlyCharges"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Charges ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="totalCharges"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Charges ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="seniorCitizen"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senior Citizen</FormLabel>
                    <Select onValueChange={(val) => field.onChange(parseInt(val))} value={field.value.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select demographic" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0">No</SelectItem>
                        <SelectItem value="1">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button type="submit" disabled={predictMutation.isPending} className="w-full">
              {predictMutation.isPending ? "Calculating..." : "Predict Risk Score"}
            </Button>
          </form>
        </Form>

        {result && (
          <div className="mt-6 p-4 rounded-lg border bg-muted/30 space-y-3 animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Risk Score Assessment</span>
              {result.probability > 50 ? (
                <Badge variant="destructive" className="flex items-center gap-1"><AlertCircle className="w-3 h-3" /> High Risk</Badge>
              ) : (
                <Badge className="bg-green-600 hover:bg-green-700 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Low Risk</Badge>
              )}
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span>Probability</span>
                <span className="font-bold">{result.probability.toFixed(1)}%</span>
              </div>
              <Progress 
                value={result.probability} 
                className="h-2" 
                indicatorClassName={result.probability > 50 ? "bg-destructive" : "bg-green-600"} 
              />
            </div>
            <p className="text-sm text-muted-foreground pt-1">
              Model output: <span className="font-medium text-foreground">{result.label}</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
