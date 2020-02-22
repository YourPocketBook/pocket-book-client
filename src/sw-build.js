/* tslint:disable */

const workboxBuild = require("workbox-build");
// NOTE: This should be run *AFTER* all your assets are built
const buildSW = () => {
  return workboxBuild
    .generateSW({
      swDest: "./build/sw.js",
      globDirectory: "build",
      globIgnores: [
        "*.map",
        "asset-manifest.json",
        "precache-manifest.*",
        "service-worker.js"
      ],
      dontCacheBustURLsMatching: /\.\w{8}\./,
      importWorkboxFrom: "local",
      navigateFallback: "/index.html",
      navigateFallbackBlacklist: [
        // Exclude URLs starting with /_, as they're likely an API call
        new RegExp("^/_"),
        // Exclude any URLs whose last part seems to be a file extension
        // as they're likely a resource and not a SPA route.
        // URLs containing a "?" character won't be blacklisted as they're likely
        // a route with query params (e.g. auth callbacks).
        new RegExp("/[^/?]+\\.[^/]+$")
      ]
    })
    .then(({ count, size, warnings }) => {
      // Optionally, log any warnings and details.
      warnings.forEach(console.warn);
      console.log(`${count} files will be precached, totaling ${size} bytes.`);
    });
};
buildSW();
