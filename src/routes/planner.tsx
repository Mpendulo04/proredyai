import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, CalendarDays, Plus, Trash2 } from "lucide-react";
import { runAssistant } from "@/lib/assistant.functions";
import { OutputBlock } from "@/components/output-block";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — ProRedy AI" },
      { name: "description", content: "Turn tasks, deadlines, and priorities into a prioritized plan and daily schedule." },
      { property: "og:title", content: "AI Task Planner" },
      { property: "og:description", content: "Turn tasks, deadlines, and priorities into a prioritized plan and daily schedule." },
    ],
  }),
  component: PlannerPage,
});

type Priority = "High" | "Medium" | "Low";
type Task = { name: string; deadline: string; priority: Priority };

function PlannerPage() {
  const run = useServerFn(runAssistant);
  const [tasks, setTasks] = useState<Task[]>([
    { name: "", deadline: "", priority: "Medium" },
  ]);
  const [timeframe, setTimeframe] = useState("today");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function update(i: number, patch: Partial<Task>) {
    setTasks((prev) => prev.map((t, idx) => (idx === i ? { ...t, ...patch } : t)));
  }
  function addTask() {
    setTasks((prev) => [...prev, { name: "", deadline: "", priority: "Medium" }]);
  }
  function removeTask(i: number) {
    setTasks((prev) => (prev.length === 1 ? prev : prev.filter((_, idx) => idx !== i)));
  }

  const validTasks = tasks.filter((t) => t.name.trim());

  async function generate() {
    if (validTasks.length === 0) return;
    setLoading(true);
    setError("");
    try {
      const res = await run({
        data: { kind: "plan", payload: { tasks: validTasks, timeframe } },
      });
      setOutput(res.text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" /> AI Task Planner
          </CardTitle>
          <CardDescription>
            Add your tasks with deadlines and priority. Get a prioritized plan and a suggested schedule.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {tasks.map((t, i) => (
              <div key={i} className="grid gap-2 rounded-lg border bg-muted/30 p-3 sm:grid-cols-[1fr_160px_140px_auto]">
                <div className="space-y-1">
                  <Label className="text-xs">Task</Label>
                  <Input
                    placeholder="E.g. Finish Q3 report"
                    value={t.name}
                    onChange={(e) => update(i, { name: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Deadline</Label>
                  <Input type="date" value={t.deadline} onChange={(e) => update(i, { deadline: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Priority</Label>
                  <Select value={t.priority} onValueChange={(v) => update(i, { priority: v as Priority })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeTask(i)}
                    disabled={tasks.length === 1}
                    aria-label="Remove task"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-end gap-3">
            <Button variant="outline" onClick={addTask}>
              <Plus className="mr-1 h-4 w-4" /> Add task
            </Button>
            <div className="space-y-1">
              <Label htmlFor="timeframe" className="text-xs">Timeframe</Label>
              <Input
                id="timeframe"
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                placeholder="today / this week"
                className="w-48"
              />
            </div>
          </div>
          <Button onClick={generate} disabled={loading || validTasks.length === 0}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate Plan
          </Button>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <OutputBlock text={output} onChange={setOutput} onRegenerate={generate} loading={loading} />
        </CardContent>
      </Card>
    </div>
  );
}
