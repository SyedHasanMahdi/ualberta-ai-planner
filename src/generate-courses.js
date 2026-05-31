import fs from "fs";

const data = JSON.parse(fs.readFileSync("courses-full.json", "utf8"));

const clean = (s) =>
  String(s || "")
    .replaceAll("\\", "\\\\")
    .replaceAll('"', '\\"')
    .replaceAll("\n", " ")
    .trim();

const splitDesc = (text) => {
  if (!text) return { description: "", restrictions: "" };

  let s = String(text).replace(/\s+/g, " ").trim();

  const splitIndex =
    s.search(/Note:|Not open|Not for credit|Students may not/i);

  let main = "";
  let rest = "";

  if (splitIndex !== -1) {
    main = s.slice(0, splitIndex).trim();
    rest = s.slice(splitIndex).trim();
  } else {
    main = s;
  }

  main = main.replace(/^Faculty of [^A-Z]*/i, "").trim();

  const end = main.indexOf(".");
  if (end !== -1) {
    main = main.slice(0, end + 1).trim();
  }

  return {
    description: main,
    restrictions: rest
  };
};

function normalizePrereqs(pre) {
  if (!pre || pre.length === 0) return null;

  const and = [];

  for (const item of pre) {
    // OR group
    if (Array.isArray(item)) {
      if (item.length === 1) {
        and.push(item[0]);
      } else {
        and.push({ or: item });
      }
    } 
    // single course
    else {
      and.push(item);
    }
  }

  return { and };
}

const output = data.map(c => {
  const { description, restrictions } = splitDesc(c.desc);

  return `{ id:"${clean(c.id)}", code:"${clean(c.code)}", name:"${clean(c.name || c.title)}", dept:"${clean(c.dept)}", cat:"${clean(c.cat)}", year:${c.year}, units:${c.units}, pre:${JSON.stringify(normalizePrereqs(c.pre))}, co:${JSON.stringify(c.co || [])}, description:"${clean(description)}", restrictions:"${clean(restrictions)}", url:"${clean(c.url)}" }`;
}).join("\n");

console.log(output);

fs.writeFileSync(
  "courses-generated.js",
  "export const courses = [\n" + output + "\n];"
);

console.log("Generated courses-generated.js");
console.log(data[0]);