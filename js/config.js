/**
 * HK LOGISTICS - Central Client Configuration
 * 
 * IMPORTANT FOR CLIENT:
 * 1. Web3Forms Access Key is loaded from environment variables (window.ENV or process.env).
 *    Get your Access Key by entering your email at https://web3forms.com
 * 2. Update the contact details below when final email/phone details are confirmed.
 */

// Environment variable resolution helper
function resolveEnv(key, fallback = "") {
  if (typeof window !== "undefined" && window.ENV && window.ENV[key]) {
    return window.ENV[key];
  }
  if (typeof process !== "undefined" && process.env && process.env[key]) {
    return process.env[key];
  }
  return fallback;
}

const HK_CONFIG = {
  // Web3Forms official API endpoint & Access Key
  WEB3FORMS_ENDPOINT: "https://api.web3forms.com/submit",
  WEB3FORMS_ACCESS_KEY: resolveEnv("WEB3FORMS_ACCESS_KEY", "your_web3forms_access_key_here"),

  // Client recipient email where all customer enquiries & RFQ quotes will be delivered
  CLIENT_EMAIL: resolveEnv("CLIENT_EMAIL", "contact@hklogistics.com"),

  // Corporate phone line
  PHONE: "+1 (800) 555-HKLOG",
  PHONE_RAW: "+18005554564",

  // Corporate Headquarters & Distribution Center Address
  ADDRESS_LINE_1: "HK Logistics Distribution Park",
  ADDRESS_LINE_2: "Gateway Commercial Corridor, Suite 400",
  ADDRESS_CITY: "Logistics Hub, Regional Freight Zone",

  // Customer Service & Operations Hours
  OPERATIONS_DESK: "24/7 Active Logistics & Dispatch Desk",
  OFFICE_HOURS: "Monday – Friday: 08:00 AM – 06:00 PM EST",

  // Core Service Offerings (used in forms and quick selectors)
  SERVICES: [
    "Warehousing",
    "Insurance Services",
    "Drop Shipment",
    "Sourcing Company"
  ]
};

// Freeze configuration to prevent inadvertent runtime mutations
if (typeof Object.freeze === 'function') {
  Object.freeze(HK_CONFIG);
}
