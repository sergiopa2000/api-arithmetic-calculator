const parser = require('./tokens');

let parsed = parser.parse("20*3/(2+3*(44+3))/20-20aaaa");
console.log(parsed);