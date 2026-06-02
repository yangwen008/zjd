// open-next.config.ts
import type { OpenNextConfig } from "@opennextjs/aws/types/open-next.js";

const config: OpenNextConfig = {
  default: {
    override: {
      wrapper: "cloudflare-node",
      converter: "edge",
    },
  },
  middleware: {
    external: true,
    override: {
      wrapper: "cloudflare-edge",
      converter: "edge",
      proxyExternalRequest: "fetch",
    },
  },
  // 静态资源绑定名（必须与 wrangler.jsonc 一致）
  assets: {
    bindingName: "ASSETS",
  },
};

export default config;