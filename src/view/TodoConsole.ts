import * as inquirer from 'inquirer';
import TodoCollection from '../service/TodoCollection';
import TodoItem from '../model/Todoitem';
import { data } from '../data';
import { Commands } from '../model/Commands';

class TodoConsole {
  private todoCollection: TodoCollection;

  private showCompleted: boolean;

  constructor() {
    this.showCompleted = true; // showCompleted의 초기값

    const sampleTodos: TodoItem[] = data.map(
      (item) => new TodoItem(item.id, item.task, item.complete)
    );

    this.todoCollection = new TodoCollection('My Todo List', sampleTodos);
  }

  displayTodoList(): void {
    console.log(
      `====${this.todoCollection.userName}====` +
        `(${this.todoCollection.getItemCounts().incomplete} items todo)`
    );
    this.todoCollection
      .getTodoItems(this.showCompleted)
      .forEach((item) => item.printDetails());
  }

  //사용자에게 입력받는 메서드
  promptUser(): void {
    console.clear();
    this.displayTodoList();

    inquirer
      .prompt({
        type: 'list',
        name: 'command',
        message: 'Choose option',
        choices: Object.values(Commands),
      })
      .then((answers) => {
        // if (answers['command'] !== Commands.Quit) {
        //   this.promptUser();
        // }
        switch (answers['command']) {
          case Commands.Toggle:
            this.showCompleted = !this.showCompleted;
            this.promptUser();
            break;
          case Commands.Add:
            this.promptAdd();
            break;
          case Commands.Purge:
            this.todoCollection.removeComplete();
            this.promptUser();
            break;
          case Commands.Complete:
            if (this.todoCollection.getItemCounts().incomplete > 0) {
              //완료되지 않은 항목이 하나 이상이면
              this.promptComplete();
            } else {
              this.promptUser();
            }
            break;
        }
      });
  }

  //할 일 추가를 위한 새로운 메서드 생성
  promptAdd(): void {
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

  promptComplete(): void {
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
        let completedTasks = answers['complete'] as number[]; //answers를 number의 배열타입이라고 단언
        this.todoCollection.getTodoItems(true).forEach((item) => {
          this.todoCollection.markComplete(
            item.id,
            completedTasks.find((id) => id === item.id) != undefined
          );
        });
        this.promptUser();
      });
  }
}

export default TodoConsole;
