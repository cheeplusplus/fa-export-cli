import { program } from "@commander-js/extra-typings";
import { ARCHIVE_COMMAND } from "./archive";

const COMMAND_TREE = program.addCommand(ARCHIVE_COMMAND);

COMMAND_TREE.parseAsync().catch((err) =>
  console.error("Got top level fatal error", err)
);
