export interface Student {
    id?: number;
    firstname: string;
    lastname: string;
    middlename: string;
    iin: string;
    phone: string;
    university: string;
    email: string;
    password: string;
}

export interface RegisterStudentRequest {
    firstname: string;
    lastname: string;
    middlename: string;
    iin: string;
    phone: string;
    studyYear: number;
    university: string;
    email: string;
    password: string;
    categoryId: number; // Added this field
}

export interface RegisterStudentResponse {
    success: boolean;
    message: string;
    student?: Student;
}