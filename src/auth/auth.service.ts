import { Injectable } from "@nestjs/common";

@Injectable({})
export class AuthService {
    login() {
        return { msg: 'I have login' }
    }

    register() {
        return { msg: 'I have register' }
    }
} 