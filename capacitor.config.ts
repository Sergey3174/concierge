import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.concierge.app",
  appName: "Concierge",
  webDir: "build",
  server: {
    allowNavigation: ["concierge-app.leverageindo.group"],
  },
};

export default config;
