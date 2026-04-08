import fs from 'fs';
const content = fs.readFileSync('C:/Users/welli/Downloads/drive.html', 'utf8');

const regex = /"1[a-zA-Z0-9_-]{32}"/g;
let match;
const ids = new Set();
while ((match = regex.exec(content)) !== null) {
  const id = match[0].replace(/"/g, '');
  if (id !== "1JFUuzgR7NWEjyw9cfN-_ZPVZZwJam404") { // exclude the folder itself
    ids.add(id);
  }
}
fs.writeFileSync('C:/Users/welli/Downloads/ids.json', JSON.stringify(Array.from(ids), null, 2));
