export const removePlusCode = (address: string): string => {
  const plusCodePattern = /([A-Z0-9]{4,6}\+?[A-Z0-9]{2,4})/g;
  if (plusCodePattern.test(address)) {
    address = address?.replace(plusCodePattern, "")?.replace(/,\s*$/, "");
  }
  return address?.replace(/^\s*,\s*/, "") || "";
};
