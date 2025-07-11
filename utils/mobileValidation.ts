import libphonenumber from "google-libphonenumber";

const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();

// Function to validate phone number
export const validatePhoneNumber = (number: string, countryCode: string): boolean => {
  try {
    console.log({number, countryCode});
    
    const phoneNumber = phoneUtil.parse(number, countryCode);
    return phoneUtil.isValidNumberForRegion(phoneNumber, countryCode);
  } catch (error) {
    return false;
  }
};

// Example usage
// const phoneNumber = "+1234567890"; // Replace with the phone number you want to validate
// const countryCode = "US"; // Replace with the country code you want to validate against

// const isValid = validatePhoneNumber(phoneNumber, countryCode);
// console.log(isValid); // true or false
