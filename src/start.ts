import { showHUD, environment, getFrontmostApplication } from "@raycast/api";
import path from "path";
import { takeScreenshot } from "./util/screenshot";

export default async function main() {
  console.log("support path", environment.supportPath);
  const outPath = path.join(environment.supportPath, "screenshot.png");
  try {
    await takeScreenshot(outPath);
  } catch (error) {
    await showHUD("Failed to take screenshot.");
    return;
  }

  const frontmostApplication = await getFrontmostApplication();
  console.log("frontmostApplication", frontmostApplication);

  await showHUD("Screenshot taken");
}
