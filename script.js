/* ===== Ground Game — contact form ===== */

// 1. Deploy the Google Apps Script (see apps-script/Code.gs + README.md).
// 2. Paste the deployed Web App URL below (it looks like:
//    https://script.google.com/macros/s/AKfyc.../exec ).
const SCRIPT_URL = "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";

document.getElementById("year").textContent = new Date().getFullYear();

const form = document.getElementById("contact-form");
const statusEl = document.getElementById("form-status");
const submitBtn = document.getElementById("submit-btn");

function setStatus(msg, kind) {
  statusEl.textContent = msg;
  statusEl.className = "form-status" + (kind ? " " + kind : "");
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Honeypot — if a bot filled the hidden "company" field, silently stop.
  if (form.company.value.trim() !== "") return;

  // Basic validation with the browser's own messages.
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  if (SCRIPT_URL.startsWith("PASTE_")) {
    setStatus("Form not configured yet. Add your Apps Script URL in script.js.", "error");
    return;
  }

  submitBtn.disabled = true;
  setStatus("Sending…");

  const data = new URLSearchParams({
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    message: form.message.value.trim(),
  });

  try {
    // form-encoded body = a "simple" CORS request (no preflight).
    // no-cors guarantees the request reaches Apps Script and the email sends;
    // we can't read the response, so a resolved promise = success.
    await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: data.toString(),
    });

    form.reset();
    setStatus("Thanks — your message is on its way. We'll be in touch soon.", "success");
  } catch (err) {
    setStatus(
      "Something went wrong. Please email michaelfontein@gmail.com directly.",
      "error"
    );
  } finally {
    submitBtn.disabled = false;
  }
});
