import axios from "axios";
import * as cheerio from "cheerio";
import Logger from "../utils/logger.js";

const logger = new Logger("Scraper");

/**
 * Scrape job description from URL
 * Tries simple HTTP first, falls back to Puppeteer for JavaScript-heavy sites
 * @param {string} url - Job posting URL
 * @returns {string} Cleaned job description text
 * @throws {Error} If scraping fails completely
 */
export async function scrapeVaga(url) {
  try {
    logger.debug("Attempting simple HTTP scrape", { url });
    return await scrapeSimples(url);
  } catch (e) {
    logger.debug("Simple HTTP scrape failed, trying Puppeteer", { error: e.message });
    return await scrapePuppeteer(url);
  }
}

/**
 * Scrape using simple HTTP + Cheerio (fast, works for static sites)
 * @private
 */
async function scrapeSimples(url) {
  const { data } = await axios.get(url, {
    timeout: 10000,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
    },
  });

  const $ = cheerio.load(data);

  // Remove irrelevant elements
  $("script, style, nav, header, footer, .cookie, .banner, iframe").remove();

  // Try common job description selectors
  const selectors = [
    ".job-description",
    ".job-details",
    "[data-testid='job-description']",
    ".description",
    "article",
    "main",
    "#job-description",
    ".posting-description",
  ];

  for (const sel of selectors) {
    const text = $(sel).text().trim();
    if (text.length > 200) return limparTexto(text);
  }

  // Fallback: use entire body
  const bodyText = $("body").text().trim();
  if (bodyText.length < 100) throw new Error("Conteudo insuficiente via HTTP simples.");
  return limparTexto(bodyText);
}

/**
 * Scrape using Puppeteer (slow, works for JS-heavy sites like LinkedIn)
 * @private
 */
async function scrapePuppeteer(url) {
  logger.debug("Starting Puppeteer scrape");
  
  // Dynamic import - puppeteer is heavy, only load if needed
  const { default: puppeteer } = await import("puppeteer");

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0"
  );

  await page.goto(url, { waitUntil: "networkidle2", timeout: 20000 });
  
  // Wait for page to stabilize (replaced deprecated waitForTimeout)
  await new Promise(resolve => setTimeout(resolve, 2000));

  const text = await page.evaluate(() => document.body.innerText);
  await browser.close();

  logger.debug("Puppeteer scrape completed");
  return limparTexto(text);
}

/**
 * Clean and normalize text
 * @private
 */
function limparTexto(text) {
  return text
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\t/g, " ")
    .replace(/ {2,}/g, " ")
    .trim()
    .slice(0, 8000); // Limit to not exceed AI context window
}

