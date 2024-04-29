import { Role } from "./role";

export class User {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    role: Role;
    token?: string;
}
