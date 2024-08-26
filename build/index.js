"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TodoCollection_1 = __importDefault(require("./TodoCollection"));
const Todoitem_1 = __importDefault(require("./Todoitem"));
const data_1 = require("./data");
const sampleTodos = data_1.data.map((item) => new Todoitem_1.default(item.id, item.task, item.complete));
const myTodoCollection = new TodoCollection_1.default('My Todo List', sampleTodos);
myTodoCollection.addTodo('JS 학습하기');
myTodoCollection.addTodo('친구 만나기');
myTodoCollection.markComplete(3, true);
console.log(`${myTodoCollection.userName}`);
myTodoCollection.removeComplete();
// myTodoCollection.todoItems.forEach((item) => item.printDetails());
myTodoCollection.getTodoItems(true).forEach((item) => item.printDetails());
console.log('==========비교==========');
myTodoCollection.getTodoItems(false).forEach((item) => item.printDetails());
