// node.js -f mytasks.txt add "Buy milk"
// node.js -f mytasks.txt list
// node.js -f mytasks.txt remove 1

const fs = require('fs').promises;
const { program } = require("commander");
const { log } = require('util');
require("colors");

const addTask = async (task, logFile) => {
    try {
        await fs.appendFile(logFile, `${task}\n`)
    }
    catch (error) {
        console.error(`Cound not save task to ${logFile}`.red);
    }
} 

const listTask = async logFile => {
    const data = await fs.readFile(logFile, `utf-8`);
    console.log(data.blue);
}

const removeTask = async (index, logFile) => {
    try {
        const data = await fs.readFile(logFile, `utf-8`);
        const arrayData = data.split(`\n`);

        if (index < 1 || index > arrayData.length) {
            console.log(`Invalid index. Please provide a number between 1 and ${arrayData.length}`);
            return;
        } 
        arrayData.splice(index - 1, 1);
        await fs.writeFile(logFile, arrayData.join(`\n`));
    } catch (error) {
            console.error(`Cound not modify file ${logFile}`.red);

        }
}

program.option("-f, --file [type]", "file for saving tasks", "tasks.txt");
program
    .command("add <task>")
    .description("Add a new task")
    .action(async task => {
        const logFile = program.opts().file;
        await addTask(task, logFile);
        console.log("Task Added!".green)
    })
program
    .command("remove <index>")
    .description("Remove a task by index")
    .action(async index => {
        const logFile = program.opts().file;
        await removeTask(index, logFile);
        console.log("Task Removed!".green)
    })

program
    .command("list")
    .description("List all task")
    .action(async () => {
        const logFile = program.opts().file;
        await listTask(logFile); 
    })

program.parse(process.argv);

// !process.argv.slice(2).length este similar cu process.argv.slice(2).length === 0 //
if (!process.argv.slice(2).length) {
    program.outputHelp();
}