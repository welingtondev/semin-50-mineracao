const fs = require('fs');
let c = fs.readFileSync('src/components/GallerySection.tsx', 'utf8');

c = c.replace('<div className="grid grid-cols-4 gap-8 opacity-70 relative">', '<div className="relative flex items-center justify-center">\\n                <div className="grid grid-cols-4 gap-8 opacity-70 relative z-10">');
c = c.replace(/{isArming && \(\s*<div className="absolute inset-0 flex items-center justify-center z-20">/, '{isArming && (\\n                  <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">');
c = c.replace(/<\/svg>\s*<\/div>\s*\)\}\s*<\/motion\.div>/, '</svg>\\n                  </div>\\n                )}\\n              </div>\\n            </div>\\n          </motion.div>');

c = c.replace(/\\n/g, '\\n'); // This is already literally a string, no need for complex replace. Wait!

// Better version:
c = fs.readFileSync('src/components/GallerySection.tsx', 'utf8');

const t1 = '<div className="grid grid-cols-4 gap-8 opacity-70 relative">';
const r1 = '<div className="relative flex items-center justify-center">\n                <div className="grid grid-cols-4 gap-8 opacity-70 relative z-10">';
c = c.replace(t1, r1);

const t2 = '{isArming && (\n                <div className="absolute inset-0 flex items-center justify-center z-20">';
const r2 = '{isArming && (\n                  <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">';
c = c.replace(t2, r2);
c = c.replace('{isArming && (\r\n                <div className="absolute inset-0 flex items-center justify-center z-20">', r2);

const regex3 = /<\/svg>\s*<\/div>\s*\)\}\s*<\/motion\.div>/;
const r3 = '</svg>\n                  </div>\n                )}\n              </div>\n            </div>\n          </motion.div>';
c = c.replace(regex3, r3);

fs.writeFileSync('src/components/GallerySection.tsx', c);
