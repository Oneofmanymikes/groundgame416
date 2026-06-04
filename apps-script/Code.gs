/**
 * Ground Game — contact form backend (Google Apps Script)
 *
 * Receives POSTs from the website's contact form and emails them to you.
 * See README.md for full setup steps. Quick version:
 *   1. Go to https://script.google.com  ->  New project
 *   2. Replace the default code with this file's contents
 *   3. Set TO_EMAIL below if you ever want to change the recipient
 *   4. Deploy  ->  New deployment  ->  type "Web app"
 *        - Execute as: Me
 *        - Who has access: Anyone
 *   5. Copy the Web App URL into the website's script.js (SCRIPT_URL)
 */

const TO_EMAIL = "michael@groundgame416.ca";
const SUBJECT_PREFIX = "[Ground Game] New inquiry from ";

function doPost(e) {
  try {
    var p = (e && e.parameter) ? e.parameter : {};

    var name = (p.name || "").toString().trim();
    var email = (p.email || "").toString().trim();
    var phone = (p.phone || "").toString().trim();
    var message = (p.message || "").toString().trim();

    if (!name || !email || !message) {
      return json({ ok: false, error: "Missing required fields." });
    }

    var body =
      "New contact form submission from groundgame416.ca\n\n" +
      "Name:    " + name + "\n" +
      "Email:   " + email + "\n" +
      "Phone:   " + (phone || "(not provided)") + "\n\n" +
      "Message:\n" + message + "\n\n" +
      "----------------------------------------\n" +
      "Sent " + new Date().toString();

    MailApp.sendEmail({
      to: TO_EMAIL,
      subject: SUBJECT_PREFIX + name,
      replyTo: email,            // hit "Reply" to answer the sender directly
      name: "Ground Game Website",
      body: body,
    });

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

// A GET just confirms the deployment is live (visit the URL in a browser).
function doGet() {
  return json({ ok: true, status: "Ground Game contact endpoint is live." });
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
