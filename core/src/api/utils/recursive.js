function recursiveObjectFlatReduce(container, reducer) {
  return Object.keys(container).reduce((acc, key, value) => {
    if (typeof value === 'object' && !!Object.keys(value).length) {
      return [
        ...acc,
        ...recursiveObjectFlatReduce(value, reducer),
      ];
    }

    return [
      ...acc,
      ...reducer(acc, key, value),
    ];
  }, []);
}

module.exports = {
  recursiveObjectFlatReduce,
}
