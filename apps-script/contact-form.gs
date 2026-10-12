/**
 * Portfolio contact form → email notification to your inbox (MailApp.sendEmail).
 *
 * Deploy as a web app with  Execute as: Me  and  Who has access: Anyone  (see README, "Contact form").
 *
 * Request (sent by src/components/Contact.tsx):
 *   GET <web app URL>?name=…&email=…&message=…&callback=<function name>
 *
 * Reply:
 *   With a valid `callback`: JSONP  →  callback({"result":"success"})  or  callback({"result":"error","error":"…"})
 *   Without one (e.g. curl):  JSON  →  {"result":"success"}  or  {"result":"error","error":"…"}
 *
 * "success" is returned only after MailApp.sendEmail completes without throwing — i.e. Gmail accepted the
 * notification for delivery. It never reports success for invalid input or a failed send.
 *
 * Optional Script Property:
 *   RECIPIENT_EMAIL  — where notifications go. Defaults to the Google account that owns the deployment.
 */

const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MIN_MESSAGE_LENGTH = 10;
const MAX_MESSAGE_LENGTH = 2000;
// Same rule the website uses, so both sides agree on what a valid address is.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// JSONP callback names must be plain identifiers, so the reply can't be turned into arbitrary script.
const CALLBACK_PATTERN = /^[A-Za-z_$][0-9A-Za-z_$]{0,63}$/;
// The same sender + message within this window is treated as an accidental resubmission (no second email).
const DUPLICATE_WINDOW_SECONDS = 600;

function doGet(e) {
  const params = (e && e.parameter) || {};
  const callback = CALLBACK_PATTERN.test(params.callback || "") ? params.callback : null;
  return respond_(handleSubmission_(params), callback);
}

function handleSubmission_(params) {
  const name = singleLine_(params.name);
  const email = singleLine_(params.email);
  const message = String(params.message || "").trim();

  if (!name || name.length > MAX_NAME_LENGTH) return error_("invalid_name");
  if (email.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(email)) return error_("invalid_email");
  if (message.length < MIN_MESSAGE_LENGTH || message.length > MAX_MESSAGE_LENGTH) return error_("invalid_message");

  const recipient =
    PropertiesService.getScriptProperties().getProperty("RECIPIENT_EMAIL") || Session.getEffectiveUser().getEmail();
  if (!recipient) return error_("recipient_not_configured");

  // Suppress accidental duplicates: only an earlier *successful* send is remembered, so this stays truthful.
  const cache = CacheService.getScriptCache();
  const duplicateKey = "sent:" + Utilities.base64EncodeWebSafe(
    Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, email.toLowerCase() + "\n" + message, Utilities.Charset.UTF_8),
  );
  if (cache.get(duplicateKey)) return { result: "success", duplicate: true };

  try {
    MailApp.sendEmail({
      to: recipient,
      replyTo: email,
      name: "Portfolio contact form",
      subject: "New Portfolio Enquiry — " + name,
      body: [
        "Name: " + name,
        "Email: " + email,
        "",
        "Message:",
        message,
        "",
        "—",
        "Sent from the contact form on your portfolio. Reply to this email to answer " + name + " directly.",
      ].join("\n"),
    });
  } catch (err) {
    console.error("Contact form: sendEmail failed — " + err);
    return error_("send_failed");
  }

  cache.put(duplicateKey, "1", DUPLICATE_WINDOW_SECONDS);
  return { result: "success" };
}

/**
 * Run this once from the Apps Script editor (Run ▸ authorizeOnce) to grant the email permission.
 * It only reads the remaining daily quota; it does not send anything.
 */
function authorizeOnce() {
  console.log("Emails remaining today: " + MailApp.getRemainingDailyQuota());
}

// Collapse line breaks and tabs: keeps the subject and reply-to header to a single, safe line.
function singleLine_(value) {
  return String(value || "").replace(/[\r\n\t]+/g, " ").trim();
}

function error_(code) {
  return { result: "error", error: code };
}

function respond_(payload, callback) {
  const json = JSON.stringify(payload);
  if (callback) {
    return ContentService.createTextOutput(callback + "(" + json + ");").setMimeType(
      ContentService.MimeType.JAVASCRIPT,
    );
  }
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}
