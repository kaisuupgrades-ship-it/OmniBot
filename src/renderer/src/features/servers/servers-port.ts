import type { OmniBotDesktopApi, ServerSummary } from "@openbot/contracts/ipc";

/**
 * What the servers domain reaches in main: the server list and selection, the account changes, the local host, the
 * settings of one server, the name, logo and update of a joined server's host, and the remote desktop
 * setup of a server.
 */
export interface ServersPort {
  agent: Pick<
    OmniBotDesktopApi["agent"],
    | "getStatus"
    | "listAgents"
    | "listConversationReads"
    | "listHiddenAgents"
    | "listMcpServers"
    | "listModels"
    | "removeMcpServer"
    | "saveMcpServer"
    | "setMcpServerEnabled"
    | "testMcpServer"
    | "signInMcpServer"
    | "mcpSignInPage"
    | "mcpSignInRelay"
    | "openMcpSignInRelay"
    | "completeMcpSignInRelay"
    | "cancelMcpSignIn"
    | "signOutMcpServer"
    | "listMcpSignIns"
    | "mcpSignInApp"
    | "saveMcpSignInApp"
    | "removeMcpSignInApp"
  >;
  events: OmniBotDesktopApi["events"];
  auth: Pick<OmniBotDesktopApi["auth"], "onEvent">;
  browser: Pick<OmniBotDesktopApi["browser"], "setVisible">;
  hostAdmin: Pick<
    OmniBotDesktopApi["hostAdmin"],
    "cancelUpdate" | "getUpdateStatus" | "startUpdate" | "updateIdentity"
  >;
  hostedServers: Pick<OmniBotDesktopApi["hostedServers"], "list" | "restart" | "wake">;
  host: Pick<
    OmniBotDesktopApi["host"],
    "configure" | "getStatus" | "onEvent" | "recheckScreenRecording" | "start" | "stop" | "updateIdentity"
  >;
  notifications: Pick<OmniBotDesktopApi["notifications"], "onOpened">;
  remoteDesktop: Pick<
    OmniBotDesktopApi["remoteDesktop"],
    "checkSetup" | "connect" | "disconnect" | "list" | "openSetup" | "test"
  >;
  servers: Pick<
    OmniBotDesktopApi["servers"],
    | "getPresence"
    | "join"
    | "list"
    | "onEvent"
    | "onPresence"
    | "refreshIdentity"
    | "remove"
    | "reorder"
    | "retryConnection"
    | "select"
    | "setMuted"
    | "setNotificationLevel"
  >;
}

/** Read on each call: tests and stories replace `window.openbot` per case. */
export function serversPort(): ServersPort {
  return window.openbot;
}

/**
 * The member and invite calls for one server. This computer answers them for the local server
 * through `host`; a remote server answers them through `servers`, addressed by its id.
 */
export type ServerAdminPort = Pick<
  OmniBotDesktopApi["host"],
  "getPresence" | "listMembers" | "listInvites" | "createInvite" | "updateMember" | "removeMember" | "revokeInvite"
>;

export function serverAdminPort(server: Pick<ServerSummary, "id" | "kind">): ServerAdminPort {
  if (server.kind === "local") return window.openbot.host;
  const serverId = server.id;
  return {
    getPresence: () => window.openbot.servers.getPresenceFor(serverId),
    listMembers: () => window.openbot.servers.listMembers(serverId),
    listInvites: () => window.openbot.servers.listInvites(serverId),
    createInvite: (input) => window.openbot.servers.createInvite(input, serverId),
    updateMember: (input) => window.openbot.servers.updateMember(input, serverId),
    removeMember: (memberId) => window.openbot.servers.removeMember(memberId, serverId),
    revokeInvite: (inviteId) => window.openbot.servers.revokeInvite(inviteId, serverId),
  };
}

/** The server main marks active. A test teardown can remove the bridge while a join is pending. */
export async function activeServerId(): Promise<string> {
  if (!window.openbot) return "local";
  return (await window.openbot.servers.list()).find((item) => item.active)?.id ?? "local";
}
