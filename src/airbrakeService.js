import { Notifier } from "@airbrake/browser";

const airbrake = new Notifier({
  projectId: process.env.REACT_APP_AIRBRAKE_ID,
  projectKey: process.env.REACT_APP_AIRBRAKE_KEY,
  environment: process.env.REACT_APP_ENVIRONMENT,
});

// Usablility of this function will be to return true incase of ignore any airbrake.
const ignoreAirbrakes = () => {
  // if detect localhost disable the airbrake. Optionally it can be enabled by the env variable.

  console.log("AIRBRAKE Notification Attempt");

  console.log("Environment:", process.env.REACT_APP_ENVIRONMENT);
  console.log("Project ID:", process.env.REACT_APP_AIRBRAKE_ID);
  console.log(
    "Enable Localhost Airbrake:",
    process.env.REACT_APP_ENABLE_LOCALHOST_AIRBRAKE
  );

  if (
    process.env.REACT_APP_ENABLE_LOCALHOST_AIRBRAKE !== "true" &&
    ["localhost", "127.0.0.1"].includes(window.location.hostname)
  ) {
    return true;
  }
  return false;
};

// This function should be placed at constructor level or at the root level. If it is placed in any function then it will not work.
airbrake.addFilter((notice) => {
  const ignoreAirbrake = ignoreAirbrakes(notice);
  if (ignoreAirbrake) {
    console.log("Ignoring AIRBRAKE");
    // Ignore errors from sessions.
    return null;
  }
  return notice;
});

export const airbrakeNotify = async (error, info = {}) => {
  console.log("AIRBRAKE");
  console.log("Error Boundary URL - ", window.location.href);
  try {
    await airbrake.notify({ error, params: { info } });
  } catch (e) {
    console.log("Error in Airbrake notification:", e);
  }
};
