const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const AMOUNT_REGEX = /^\d+(\.\d{1,4})?$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

export function isValidPassword(password: string): boolean {
  return password.length >= 8 && password.length <= 72;
}

export function isValidAmount(amount: string): boolean {
  if (!AMOUNT_REGEX.test(amount)) return false;
  const num = parseFloat(amount);
  return num > 0 && num <= 999999999;
}

export function isValidCurrency(currency: string): boolean {
  return ["USD", "EUR", "GBP", "JPY", "IDR"].includes(currency);
}

export function validateLoginForm(
  email: string,
  password: string
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!email.trim()) errors.email = "Email is required";
  else if (!isValidEmail(email)) errors.email = "Invalid email format";

  if (!password) errors.password = "Password is required";

  return errors;
}

export function validateRegisterForm(
  email: string,
  password: string,
  confirmPassword: string
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!email.trim()) errors.email = "Email is required";
  else if (!isValidEmail(email)) errors.email = "Invalid email format";

  if (!password) errors.password = "Password is required";
  else if (!isValidPassword(password))
    errors.password = "Password must be 8-72 characters";

  if (password !== confirmPassword)
    errors.confirmPassword = "Passwords do not match";

  return errors;
}

export function validateTransferForm(
  toWalletId: string,
  amount: string
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!toWalletId.trim()) errors.toWalletId = "Recipient wallet is required";

  if (!amount.trim()) errors.amount = "Amount is required";
  else if (!isValidAmount(amount)) errors.amount = "Invalid amount";

  return errors;
}
