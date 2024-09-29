export interface userData {
    token: string;
user:{
    username: string;
    email: string;
    created_at: Date;
    updated_at: Date;
    user_id: string;
}

}
export interface subtask{
    subtask_id: number;
    title: string;
    is_completed: boolean;
}



export interface TaskData {
    task_id?: string;
    title?: string;  
    due_date?: string;
    description?: string;
    time?: any;
    priority?: string;
    status?: string;
    subtasks?: subtask[];
    created_at?: any;
  }
  