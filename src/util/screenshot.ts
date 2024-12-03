import { runAppleScript } from "@raycast/utils";
import path from "node:path";

async function getNumberOfDisplays(): Promise<number> {
	try {
		const script = `do shell script "system_profiler SPDisplaysDataType | grep -c 'Displays'"`;
		const result = await runAppleScript(script);
		return Number.parseInt(result.trim(), 10);
	} catch (error) {
		console.error("Failed to get number of displays:", error);
		return 1; // Fallback to 1 display if detection fails
	}
}

export async function takeScreenshot(outPath: string) {
	const dir = path.dirname(outPath);
	const baseFilename = path.basename(outPath, path.extname(outPath));
	const ext = path.extname(outPath);

	try {
		const displayCount = await getNumberOfDisplays();
		console.log("displayCount", displayCount);
		const displays = Array.from({ length: displayCount }, (_, i) => i + 1);

		// Take screenshots of all displays
		const promises = displays.map(async (displayNum) => {
			const displayPath = `${dir}/${baseFilename}_${displayNum}${ext}`;
			// -x: no sound
			// -D: capture specific display
			const shellScript = `screencapture -x -D ${displayNum} '${displayPath}'`;
			await runAppleScript(`do shell script "${shellScript}"`);
			return displayPath;
		});

		await Promise.all(promises);
	} catch (error) {
		console.error("Failed to take screenshots.", error);
		throw new Error("Failed to take screenshots");
	}
}
