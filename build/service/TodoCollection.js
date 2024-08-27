"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Todoitem_1 = __importDefault(require("../model/Todoitem"));
class TodoCollection {
    constructor(userName, todoItems = []) {
        this.userName = userName;
        this.nextId = 1;
        this.itemMap = new Map(); //인스턴스화
        todoItems.forEach((item) => this.itemMap.set(item.id, item)); //itemMap에 저장 .set()메서드 사용
    }
    getTodoById(id) {
        // return this.todoItems.find((item) => item.id === id);
        return this.itemMap.get(id); // itemMap 에서 get()으로 꺼내서 반환
    }
    addTodo(task) {
        while (this.getTodoById(this.nextId)) {
            this.nextId++;
        }
        // this.todoItems.push(new TodoItem(this.nextId, task));
        this.itemMap.set(this.nextId, new Todoitem_1.default(this.nextId, task));
        return this.nextId;
    }
    //includeComplete이 true라면 완료된 항목까지 배열로 반환
    //false라면 완료된 할 일 목록은 제외하고, 완료되지 않은 할 일 목록만 배열로 반환
    getTodoItems(includeComplete) {
        return [...this.itemMap.values()] //itemMap에 있는 모든 요소들을 배열로 만듬, ...은 전개연산자
            .filter((item) => includeComplete || !item.complete); //filter(조건 - boolean으로 반환되어야 함)
    }
    //완료된 항목 삭제
    removeComplete() {
        this.itemMap.forEach((item) => {
            if (item.complete) {
                this.itemMap.delete(item.id);
            }
        });
    }
    // getItemCounts():{total: number, incomplete: number}{
    getItemCounts() {
        return {
            total: this.itemMap.size,
            incomplete: this.getTodoItems(false).length, //완료되지 않은 항목에 대한 갯수를 보여즘
        };
    }
    markComplete(id, complete) {
        const todoItem = this.getTodoById(id);
        if (todoItem) {
            todoItem.complete = complete;
        }
    }
}
exports.default = TodoCollection;
