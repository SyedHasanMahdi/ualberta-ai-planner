import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";

const BASE =
  "https://apps.ualberta.ca/catalogue/search?keywords=&logicalSubject=&catalog_min=&catalog_max=499&careers=UGRD&page=";

async function scrapePage(page) {
  const { data } = await axios.get(BASE + page);

  const $ = cheerio.load(data);

  const courses = [];

  $("a").each((_, el) => {
    const text = $(el).text().trim();

    const match = text.match(/^([A-Z]{2,10})\s+(\d{3})/);

    if (!match) return;

    courses.push({
      code: `${match[1]} ${match[2]}`,
      title: text,
    });
  });

  return courses;
}

async function main() {
  const all = [];

  for (let page = 1; page <= 100; page++) {
    console.log(`Scraping page ${page}`);

    const courses = await scrapePage(page);

    if (courses.length === 0) break;

    all.push(...courses);
  }

  const unique = [
    ...new Map(
      all.map(course => [course.code, course])
    ).values(),
  ];

  fs.writeFileSync(
    "./src/courses.json",
    JSON.stringify(unique, null, 2)
  );

  console.log(`Saved ${unique.length} courses`);
}

main();