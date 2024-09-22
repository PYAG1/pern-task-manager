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