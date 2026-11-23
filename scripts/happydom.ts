// Browser globals (document, window, …) for the UI challenges' component
// tests, preloaded for every root `bun test` run (see bunfig.toml). Pure-logic
// tests don't use them. Each UI project preloads its own copy for `bun test`
// run inside its folder.
import { GlobalRegistrator } from "@happy-dom/global-registrator";

GlobalRegistrator.register();
