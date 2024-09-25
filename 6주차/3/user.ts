import express, { Request, Response, NextFunction } from "express";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import mariadb from "../mariadb.js";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";

const privateKey = process.env.PRIVATE_KEY!;
console.log(privateKey);
const router = express.Router();

interface User {
    id: number;
    email: string;
    password: string;
    name: string;
    tel: string;
    created_at: string;
}

// 로그인
router.post(
    "/login",
    body("email").notEmpty().isEmail().withMessage("이메일 입력 필요"),
    body("password").notEmpty().isString().withMessage("비밀번호 입력 필요"),
    checkValidation,
    async (req: Request, res: Response) => {
        try {
            const { email, password }: User = req.body;
            const sql = "SELECT * FROM `users` WHERE `email`= ? AND `password`= ?";
            const values = [email, password];
            const [results] = await mariadb.query<RowDataPacket[]>(sql, values);
            const loginUser = results[0];
            if (loginUser) {
                const payload = { ...loginUser };
                const options = {
                    expiresIn: "30m",
                    issuer: "JaeHyeok",
                };
                const token = jwt.sign(payload, privateKey, options);
                res.cookie("token", token, { httpOnly: true });
                res.send(`${loginUser.name}님, 환영합니다`);
            } else res.status(403).send("아이디 또는 패스워드를 확인해주세요");
        } catch (e) {
            const err = e as Error;
            res.status(404).json(err);
        }
    },
);

function checkValidation(req: Request, res: Response, next: NextFunction) {
    const err = validationResult(req);
    if (err.isEmpty()) next();
    else return res.status(400).json(err.array());
}
