const { info, log } = require("./commonsjs_module");
// import {info, log} from "./es_module"

global.foo = 3;
// console.log(global.foo)
console.log(`Argumentele linie de comanda: ${process.argv}`)
// process.argv.forEach(arg => console.log(arg.toUpperCase()));

console.log(process.argv[2] + process.argv[3]);

console.log(`Directorul curent: ${process.cwd()}`)
console.log(`Calea scriptului curent: ${__filename}`)
console.log(`Directorul scriptului curent: ${__dirname}`)

process.nextTick(() => {
    console.log("NextTick callback")
});


process.chdir("..");
console.log(`Directorul curent: ${process.cwd()}`)
console.log(`Directorul scriptului curent: ${__dirname}`)

info("information");
log("Log message");

// process.exit(0);