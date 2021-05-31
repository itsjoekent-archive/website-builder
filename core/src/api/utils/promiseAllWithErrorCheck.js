async function promiseAllWithErrorCheck(...promises) {
  try {
    const results = await Promise.all(promises);

    return results.find((result) => result instanceof Error) || true;
  } catch (error) {
    return error;
  }
}

module.exports = promiseAllWithErrorCheck;
