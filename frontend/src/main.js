const API_URL = import.meta.env.VITE_API_URL || "https://tm7aoixlyh.execute-api.eu-north-1.amazonaws.com";

const form = document.getElementById("shortenForm");
const longUrlInput = document.getElementById("longUrl");
const submitBtn = document.getElementById("submitBtn");
const errorEl = document.getElementById("error");
const resultSection = document.getElementById("result");
const shortUrlInput = document.getElementById("shortUrl");
const shortLinkEl = document.getElementById("shortLink");
const copyBtn = document.getElementById("copyBtn");

function showError(message) {
  errorEl.textContent = message;
  errorEl.style.display = message ? "block" : "none";
}

function setLoading(loading) {
  submitBtn.disabled = loading;
  submitBtn.textContent = loading ? "Shortening…" : "Shorten";
}

async function shortenUrl(longUrl) {
  let res;
  try {
    res = await fetch(`${API_URL}/shorten`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ longUrl: longUrl.trim() }),
    });
  } catch (err) {
    throw new Error(
      "Cannot reach the API. Check that the backend is deployed and CORS is enabled (run: npx serverless deploy in backend)."
    );
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || data.message || `Request failed (${res.status})`);
  }
  return data;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  showError("");
  resultSection.hidden = true;

  const url = longUrlInput.value.trim();
  if (!url) {
    showError("Please enter a URL.");
    return;
  }

  try {
    setLoading(true);
    const { shortUrl, shortCode } = await shortenUrl(url);
    shortUrlInput.value = shortUrl;
    shortLinkEl.href = shortUrl;
    shortLinkEl.textContent = shortUrl;
    resultSection.hidden = false;
    shortUrlInput.select();
  } catch (err) {
    showError(err.message || "Something went wrong. Try again.");
  } finally {
    setLoading(false);
  }
});

copyBtn.addEventListener("click", async () => {
  const value = shortUrlInput.value;
  if (!value) return;
  try {
    await navigator.clipboard.writeText(value);
    const label = copyBtn.textContent;
    copyBtn.textContent = "Copied!";
    setTimeout(() => {
      copyBtn.textContent = label;
    }, 2000);
  } catch {
    shortUrlInput.select();
    document.execCommand("copy");
    copyBtn.textContent = "Copied!";
    setTimeout(() => {
      copyBtn.textContent = "Copy";
    }, 2000);
  }
});
