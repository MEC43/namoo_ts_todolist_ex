"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer = __importStar(require("inquirer"));
const TodoCollection_1 = __importDefault(require("../service/TodoCollection"));
const Todoitem_1 = __importDefault(require("../model/Todoitem"));
const data_1 = require("../data");
const Commands_1 = require("../model/Commands");
class TodoConsole {
    constructor() {
        this.showCompleted = true; // showCompleted의 초기값
        const sampleTodos = data_1.data.map((item) => new Todoitem_1.default(item.id, item.task, item.complete));
        this.todoCollection = new TodoCollection_1.default('My Todo List', sampleTodos);
    }
    displayTodoList() {
        console.log(`====${this.todoCollection.userName}====` +
            `(${this.todoCollection.getItemCounts().incomplete} items todo)`);
        this.todoCollection
            .getTodoItems(this.showCompleted)
            .forEach((item) => item.printDetails());
    }
    //사용자에게 입력받는 메서드
    promptUser() {
        console.clear();
        this.displayTodoList();
        inquirer
            .prompt({
            type: 'list',
            name: 'command',
            message: 'Choose option',
            choices: Object.values(Commands_1.Commands),
        })
            .then((answers) => {
            // if (answers['command'] !== Commands.Quit) {
            //   this.promptUser();
            // }
            switch (answers['command']) {
                case Commands_1.Commands.Toggle:
                    this.showCompleted = !this.showCompleted;
                    this.promptUser();
                    break;
                case Commands_1.Commands.Add:
                    this.promptAdd();
                    break;
                case Commands_1.Commands.Purge:
                    this.todoCollection.removeComplete();
                    this.promptUser();
                    break;
                case Commands_1.Commands.Complete:
                    if (this.todoCollection.getItemCounts().incomplete > 0) {
                        this.promptComplete();
                    }
                    else {
                        this.promptUser();
                    }
                    break;
            }
        });
    }
    //할 일 추가를 위한 새로운 메서드 생성
    promptAdd() {
        console.clear();
        inquirer
            .prompt({
            type: 'input',
            name: 'add',
            message: 'Enter Task',
        })
            .then((answers) => {
            if (answers['add'] !== '') {
                this.todoCollection.addTodo(answers['add']);
            }
            this.promptUser();
        });
    }
    promptComplete() {
        console.clear();
        inquirer
            .prompt({
            type: 'checkbox',
            name: 'complete',
            message: 'Mark Tasks Complete',
            choices: this.todoCollection
                .getTodoItems(this.showCompleted)
                .map((item) => ({
                name: item.task,
                value: item.id,
                checked: item.complete,
            })),
        })
            .then((answers) => {
            let completedTasks = answers['complete']; //answers를 number의 배열타입이라고 단언
            this.todoCollection.getTodoItems(true).forEach((item) => {
                this.todoCollection.markComplete(item.id, completedTasks.find((id) => id === item.id) != undefined);
            });
            this.promptUser();
        });
    }
}
exports.default = TodoConsole;
