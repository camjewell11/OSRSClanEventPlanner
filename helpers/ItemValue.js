export const GetItemValue = (value) => {
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) {
        return "Value: Untradable";
    } else if (numericValue >= 1_000_000_000) {
        return "Value: " + parseFloat((numericValue / 1_000_000_000).toFixed(2)) + "b gp";
    } else if (numericValue >= 1_000_000) {
        return "Value: " + parseFloat((numericValue / 1_000_000).toFixed(2)) + "m gp";
    } else {
        return "Value: " + numericValue + "gp";
    }
};