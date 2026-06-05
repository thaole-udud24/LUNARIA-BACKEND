const fs = require('fs');
const content = fs.readFileSync('src/layouts/ShopLayout.less', 'utf8');

let depth = 0;
let lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (let j = 0; j < line.length; j++) {
        if (line[j] === '{') depth++;
        if (line[j] === '}') depth--;
    }
    if (depth < 0) {
        console.log('Extra closing brace found at line', i + 1);
        break;
    }
}
if (depth > 0) {
    console.log('Missing closing brace. Remaining depth:', depth);
} else if (depth === 0) {
    console.log('Braces are perfectly balanced!');
}
