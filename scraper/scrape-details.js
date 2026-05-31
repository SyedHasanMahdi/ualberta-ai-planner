import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs/promises";
import pLimit from "p-limit";

const BASE = "https://apps.ualberta.ca/catalogue/course";

const DEPARTMENTS = new Set([
  "ACCTG","BTM","BUAN","BUEC","BUS","CHEM","CME","CMPUT",
  "DES","EAS","ECE","ECON","ENGG","ENGL","FIN","MARK",
  "MATH","MCTR","MGTSC","OM","STAT","SUST","WRS"
]);

const limit = pLimit(8);

// normalize course id
function makeId(dept, num) {
  return `${dept}${num}`;
}

// clean text
function clean(text) {
  if (!text) return "";
  return text.replace(/\s+/g, " ").replace(/\u00a0/g, " ").trim();
}

// extract description properly
function extractDescription($) {
  const candidates = [
    $(".course__description").text(),
    $(".catalogue__description").text(),
    $("meta[name='description']").attr("content"),
    $("p").first().text()
  ];

  for (const c of candidates) {
    const t = clean(c);
    if (t && t.length > 20) return t.slice(0, 1200);
  }

  return "";
}

// extract restrictions more reliably
function extractRestrictions($) {
  const blocks = $("p, li, div")
    .map((i, el) => $(el).text())
    .get()
    .map(clean)
    .filter(Boolean);

  const found = blocks.find(t =>
    /restriction|not open|credit|prerequisite|cannot|excluded/i.test(t)
  );

  return found || "";
}

// extract units safely
function extractUnits($) {
  const text = $("h2, p, div").text();
  const match = text.match(/(\d+(\.\d+)?)\s*units?/i);
  return match ? Number(match[1]) : 3;
}

// extract prereqs/coreqs
function extractCourseCodes(text) {
  if (!text) return [];
  const matches = text.match(/[A-Z]{3,5}\s?\d{3}/g);
  if (!matches) return [];
  return [...new Set(matches.map(x => x.replace(/\s/g, "")))];
}

async function fetchCourse(course) {
  try {
    const [dept, num] = course.code.split(" ");
    if (!dept || !num) return null;

    const url = `${BASE}/${dept}/${num}`;
    const res = await axios.get(url, { timeout: 15000 });
    const $ = cheerio.load(res.data);

    const titleRaw = $("h1").first().text();
    const title = clean(titleRaw).replace(course.code, "").replace("-", "").trim();

    const desc = extractDescription($);
    const restrictions = extractRestrictions($);
    const units = extractUnits($);

    const prereqText = $("*:contains('Prerequisite')").first().text();
    const coreqText = $("*:contains('Corequisite')").first().text();

    const pre = extractCourseCodes(prereqText);
    const co = extractCourseCodes(coreqText);

    const id = makeId(dept, num);

    if (!DEPARTMENTS.has(dept)) return null;

    return {
      id,
      code: `${dept} ${num}`,
      name: clean(title || `${dept} ${num}`),
      dept,
      cat: "General",
      year: Math.floor(Number(num) / 100) || 1,
      units: units || 3,
      pre,
      co,
      description: desc,
      restrictions,
      url
    };

  } catch (err) {
    const [dept, num] = course.code.split(" ");

    return {
      id: `${dept}${num}`,
      code: course.code,
      name: course.code,
      dept: dept || "",
      cat: "General",
      year: 1,
      units: 3,
      pre: [],
      co: [],
      description: "",
      restrictions: "",
      url: `${BASE}/${dept}/${num}`
    };
  }
}

async function main() {
  const raw = await fs.readFile("src/courses.json", "utf-8");
  const courses = JSON.parse(raw);

  console.log("Total courses", courses.length);

  const results = [];

  for (let i = 0; i < courses.length; i += 200) {
    const batch = courses.slice(i, i + 200);

    const enriched = await Promise.all(
      batch.map(c => limit(() => fetchCourse(c)))
    );

    results.push(...enriched.filter(Boolean));

    console.log(`Processed ${Math.min(i + 200, courses.length)}/${courses.length}`);
  }

  await fs.writeFile(
    "src/ALL_COURSES.js",
    "export const ALL_COURSES = " + JSON.stringify(results, null, 2),
    "utf-8"
  );

  console.log("Saved ALL_COURSES.js");
}

main();