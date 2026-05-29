import { toDigits } from "./phoneMask";

const STORAGE_KEY = "neuroviva.schedule.whatsappPhone.v1";

export function loadWhatsAppPhoneDigits() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return "";
    return toDigits(raw);
  } catch {
    return "";
  }
}

export function saveWhatsAppPhoneDigits(digits) {
  try {
    window.localStorage.setItem(STORAGE_KEY, toDigits(digits ?? ""));
  } catch {
    // ignore write errors (private mode / quota)
  }
}

