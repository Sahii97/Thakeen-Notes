const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'src', 'index.css');
let css = fs.readFileSync(cssPath, 'utf8');

// Strip out existing font-face declarations
css = css.replace(/@font-face\s*\{[\s\S]*?\}/g, '');

const fonts = [
    { family: 'ThmanyahSans', weight: 400, relative: 'thmanyahsans/woff2/thmanyahsans-Regular.woff2' },
    { family: 'ThmanyahSans', weight: 500, relative: 'thmanyahsans/woff2/thmanyahsans-Medium.woff2' },
    { family: 'ThmanyahSans', weight: 700, relative: 'thmanyahsans/woff2/thmanyahsans-Bold.woff2' },
    { family: 'ThmanyahSerifText', weight: 400, relative: 'thmanyahseriftext/woff2/thmanyahseriftext-Regular.woff2' },
    { family: 'ThmanyahSerifText', weight: 500, relative: 'thmanyahseriftext/woff2/thmanyahseriftext-Medium.woff2' },
    { family: 'ThmanyahSerifText', weight: 700, relative: 'thmanyahseriftext/woff2/thmanyahseriftext-Bold.woff2' },
    { family: 'ThmanyahSerifDisplay', weight: 400, relative: 'thmanyahserifdisplay/woff2/thmanyahserifdisplay-Regular.woff2' },
    { family: 'ThmanyahSerifDisplay', weight: 500, relative: 'thmanyahserifdisplay/woff2/thmanyahserifdisplay-Medium.woff2' },
    { family: 'ThmanyahSerifDisplay', weight: 700, relative: 'thmanyahserifdisplay/woff2/thmanyahserifdisplay-Bold.woff2' },
];

let fontFaces = '';
for (const f of fonts) {
    const fullPath = path.join(__dirname, 'public', 'fonts', f.relative);
    if (fs.existsSync(fullPath)) {
        const b64 = fs.readFileSync(fullPath).toString('base64');
        fontFaces += `
@font-face {
  font-family: '${f.family}';
  src: url('data:font/woff2;charset=utf-8;base64,${b64}') format('woff2');
  font-weight: ${f.weight};
  font-style: normal;
  font-display: swap;
}\n`;
    } else {
        console.error('Missing font: ' + fullPath);
    }
}

css = css.replace('@layer base {', '@layer base {\n' + fontFaces);
fs.writeFileSync(cssPath, css);
console.log('Fonts successfully converted to Base64 Text and embedded!');
