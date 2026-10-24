import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setCrf(16);
// Remotion's bundled headless shell can hang on "Waiting for root component"; point this at another Chrome.
if (process.env.REMOTION_BROWSER_EXECUTABLE) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER_EXECUTABLE);
}
// The default (7 tabs here) makes some tabs time out on "got no response"; 2 renders reliably.
Config.setConcurrency(2);
