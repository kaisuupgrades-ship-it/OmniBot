import { type IpcRendererEvent, ipcRenderer } from "electron";

ipcRenderer.once("omnibot-team-webrtc-port", (event: IpcRendererEvent) => {
  const port = event.ports[0];
  if (!port) throw new Error("The Team WebRTC message port is missing.");
  window.postMessage("omnibot-team-webrtc-port", "*", [port]);
});
