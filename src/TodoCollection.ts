import TodoItem from './Todoitem';

class TodoCollection {
  private nextId: number = 1;

  private itemMap: Map<number, TodoItem>; //Map<>객체 생성

  constructor(public userName: string, todoItems: TodoItem[] = []) {
    this.itemMap = new Map<number, TodoItem>(); //인스턴스화
    todoItems.forEach((item) => this.itemMap.set(item.id, item)); //itemMap에 저장 .set()메서드 사용
  }

  getTodoById(id: number): TodoItem | undefined {
    // return this.todoItems.find((item) => item.id === id);
    return this.itemMap.get(id); // itemMap 에서 get()으로 꺼내서 반환
  }

  addTodo(task: string): number {
    while (this.getTodoById(this.nextId)) {
      this.nextId++;
    }
    // this.todoItems.push(new TodoItem(this.nextId, task));
    this.itemMap.set(this.nextId, new TodoItem(this.nextId, task));
    return this.nextId;
  }

  //includeComplete이 true라면 완료된 항목까지 배열로 반환
  //false라면 완료된 할 일 목록은 제외하고, 완료되지 않은 할 일 목록만 배열로 반환
  getTodoItems(includeComplete: boolean): TodoItem[] {
    return [...this.itemMap.values()] //itemMap에 있는 모든 요소들을 배열로 만듬, ...은 전개연산자
      .filter((item) => includeComplete || !item.complete); //filter(조건 - boolean으로 반환되어야 함)
  }

  //완료된 항목 삭제
  removeComplete(): void {
    this.itemMap.forEach((item) => {
      if (item.complete) {
        this.itemMap.delete(item.id);
      }
    });
  }

  markComplete(id: number, complete: boolean): void {
    const todoItem = this.getTodoById(id);
    if (todoItem) {
      todoItem.complete = complete;
    }
  }
}

export default TodoCollection;
