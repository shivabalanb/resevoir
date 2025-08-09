// Function to format account balances
export function formatBalance(balance, decimals, decimalPlaces = 6) {
  let strValue = balance.toString();

  if (strValue.length <= decimals) {
    strValue = strValue.padStart(decimals + 1, "0");
  }

  const decimalPos = strValue.length - decimals;

  const result =
    strValue.slice(0, decimalPos) + "." + strValue.slice(decimalPos);

  return parseFloat(result).toFixed(decimalPlaces);
}
