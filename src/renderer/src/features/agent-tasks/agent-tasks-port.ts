import type { OmniBotDesktopApi } from "@openbot/contracts/ipc";

/** What the task state reaches in main: the task list, a task's conversation, and the task actions. */
export interface AgentTasksPort {
  agent: Pick<
    OmniBotDesktopApi["agent"],
    | "closeTask"
    | "listTasks"
    | "readTask"
    | "reopenTask"
    | "runQueuedMessageAsTask"
    | "sendMessage"
    | "startTask"
    | "stopTask"
  >;
}

/** Read on each call: tests and stories replace `window.openbot` per case. */
export function agentTasksPort(): AgentTasksPort {
  return window.openbot;
}
