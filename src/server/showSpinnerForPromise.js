// @flow
const ora = require("ora");

async function showSpinnerForPromise<ResolveType>(
  runningMessage: string,
  successMessage: string,
  promise: Promise<ResolveType>
): Promise<ResolveType> {
  const spinner = ora(runningMessage).start();
  let result;
  try {
    result = await promise;
  } catch (err) {
    spinner.fail();
    throw err;
  }
  spinner.succeed(successMessage);
  return result;
}

module.exports = showSpinnerForPromise;
