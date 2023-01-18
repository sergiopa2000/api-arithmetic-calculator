const parser = require('./parser');

let parsed = parser.parse("20*3/(2+3*(44+3))/20-20");
console.log(parsed);