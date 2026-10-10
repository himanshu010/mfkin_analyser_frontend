import { CircleAlert, Info } from "lucide-react";
import { cn } from "../lib/cn.js";
import ProgressBar from "./ui/ProgressBar.jsx";

// A one-line status: "info" (with an optional working bar) or "error" (with an optional action).
const Notice = ({ tone = "info", children, action, busy }) => {
  const Icon = tone === "error" ? CircleAlert : Info;
  return (
    <div
      className={cn(
        "card flex flex-col gap-3 p-4 sm:flex-row sm:items-center",
        tone === "error" ? "border-down/40" : "border-primary/40"
      )}
      role={tone === "error" ? "alert" : "status"}
    >
      <div className="flex flex-1 items-start gap-3 text-sm">
        <Icon
          aria-hidden
          className={cn("mt-0.5 size-4 shrink-0", tone === "error" ? "text-down" : "text-primary")}
        />
        <span>{children}</span>
      </div>
      {busy ? <ProgressBar className="sm:w-48" label="Loading" /> : null}
      {action}
    </div>
  );
};

export default Notice;
