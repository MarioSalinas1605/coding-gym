// Browser globals (document, window, …) for the component tests, preloaded by
// bunfig.toml. The root bunfig.toml preloads the same setup for root `bun test`.
import { GlobalRegistrator } from "@happy-dom/global-registrator";

GlobalRegistrator.register();
