// open-next.config.ts
const config = {
  default: {
    override: {
      wrapper: "cloudflare-node",
      converter: "edge",
      incrementalCache: "dummy" as const,
      tagCache: "dummy" as const,
      queue: "dummy" as const,
    },
  },

  middleware: {
    external: true,
    override: {
      wrapper: "cloudflare-edge",
      converter: "edge",
      proxyExternalRequest: "fetch" as const,
    },
  },

  dangerous: {
    enableCacheInterception: false,
  },
};

export default config;