// bonusLogic.js

export const initializeCombinations = (combinations) => {
  return combinations.map(arr => [...arr]);
};

export const recalculateValidCombinations = (originalCombinations, selectedCustomBonuses) => {
  const currentSelections = selectedCustomBonuses.filter(val => val !== 0);
  let tempCombos = originalCombinations.map(combo => [...combo]);

  currentSelections.forEach(selection => {
    tempCombos = tempCombos.filter(combo => combo.includes(selection));
    tempCombos = tempCombos.map(combo => {
      const idx = combo.indexOf(selection);
      if (idx !== -1) combo.splice(idx, 1);
      return combo;
    });
  });

  return tempCombos;
};

export const isCombinationComplete = (tempCombos) => {
  return tempCombos.some(combo => combo.length === 0);
};

export const getAvailableOptions = (originalCombinations, selectedCustomBonuses) => {
  let availableOptions = new Set([0]);

  const currentSelections = selectedCustomBonuses.filter(val => val !== 0);
  let tempCombos = originalCombinations.map(combo => [...combo]);

  currentSelections.forEach(selection => {
    tempCombos = tempCombos.filter(combo => combo.includes(selection));
    tempCombos = tempCombos.map(combo => {
      const idx = combo.indexOf(selection);
      if (idx !== -1) combo.splice(idx, 1);
      return combo;
    });
  });

  tempCombos.forEach(combo => {
    combo.forEach(option => availableOptions.add(option));
  });

  return Array.from(availableOptions);
};
