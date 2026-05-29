const STORAGE_KEY = "neuroviva.schedule.whatsappPhone.v1";

export function loadWhatsAppPhoneDigits() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return "";
    const digits = String(raw).replace(/\D/g, "").slice(0, 11);
    return digits;
  } catch {
    return "";
  }
}

export function saveWhatsAppPhoneDigits(digits) {
  try {
    const next = String(digits ?? "").replace(/\D/g, "").slice(0, 11);
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // ignore write errors (private mode / quota)
  }
}

