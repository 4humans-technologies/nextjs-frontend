const fs = require("fs");
const path = require("path");

// const pages = path.join([__dirname,"./src/components"])
// const components = path.join([__dirname,"./src/"])
// const features = path.join([__dirname,"./src/"])
const rootPath = "./src";

let pathToTraverse = [rootPath];
const allJSX = [];
while (pathToTraverse.length !== 0) {
  const bufferPaths = [];
  pathToTraverse.forEach((path) => {
    fs.readdirSync(path).forEach((file) => {
      if (!file.includes(".")) {
        bufferPaths.push(`${path}/${file}`);
      } else {
        if (file.endsWith(".jsx") || file.endsWith(".js")) {
          allJSX.push(`${path}/${file}`);
          // console.log(`${path}/${file}`);
        }
      }
    });
  });
  pathToTraverse = [...bufferPaths];
}

allJSX.forEach((jsx) => {
  const fileName = jsx.split("/");

  console.log(jsx);
  const classRegex = /\sclassName\s?=\s?["'].+["']\s*/g;
  let data = fs.readFileSync(jsx, { encoding: "utf-8" }).substr(0);

  const matchedClasses = data.match(/\sclassName\s?=\s?["'].+["']\s*/g);
  if (matchedClasses !== null) {
    matchedClasses.forEach((match) => {
      const newClasses = match
        .match(/["'].+["']/)[0]
        .slice(1, -1)
        .trim()
        .split(" ")
        .filter((cls) => cls !== "");
      const a = newClasses.map((cls) => {
        if (cls.includes(":")) {
          const splitClass = cls.split(":");
          return `${splitClass[0]}:tw-${splitClass[1]}`;
        } else {
          return `tw-${cls}`;
        }
      });
      const newCls = a.join(" ");
      data = data.replace(match, ` className = "${newCls}" `);
    });
    // `./tw-added/${ab}/${fileName[fileName.length - 1]}`
    fs.writeFileSync(jsx, data);
  }
});
