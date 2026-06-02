import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  // 启用 Edge 运行时兼容性
  compatibilityFlags: ["nodejs_compat"],
  
  // 静态资源输出目录（必须与 wrangler.jsonc 一致）
  outputDir: ".open-next",
  
  // 中间件配置（支持你的 middleware.ts）
  middleware: {
    external: true,
  },
  
  // 静态资源处理
  assets: {
    bindingName: "ASSETS",
  },
  
  // 服务器函数配置
  override: {
    wrapper: "cloudflare-node",
    converter: "edge",
  },
});