import { defineConfig } from "vite";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
  },
  plugins: [
    {
      // Some OS/system configurations register .ts as text/vnd.trolltech.linguist
      // or video/mp2t. Force the correct MIME type for the dev server so browsers
      // don't reject TypeScript module scripts.
      name: "ts-mime",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url?.split("?")[0].endsWith(".ts")) {
            res.setHeader("Content-Type", "application/javascript");
          }
          next();
        });
      },
    },
  ],
});
