import express, { Response } from "express";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import mariadb from "../mariadb.js";
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
router.post("/login", async (req, res) => {
    try {
        const { email, password }: User = req.body;
        const sql = "SELECT * FROM `users` WHERE `email`= ? AND `password`= ?";
        const values = [email, password];
        const [results] = await mariadb.query<RowDataPacket[]>(sql, values);
        const loginUser = results[0];
        if (loginUser) res.send(`${loginUser.name}님, 환영합니다`);
        else res.status(400).send("아이디 또는 패스워드를 확인해주세요");
    } catch (e) {
        const err = e as Error;
        res.status(404).json(err);
    }
});

// 회원가입
router.post("/join", async (req, res) => {
    try {
        const { email, password, name, tel }: User = req.body;
        const sql = "INSERT INTO users (??) VALUES (?)";
        const cols = ["email", "password", "name", "tel"];
        const values = [email, password, name, tel];
        const [results] = await mariadb.query<ResultSetHeader>(sql, [cols, values]);
        console.log(results);
        res.status(201).send(`🎉${name}님 환영합니다🎉`);
    } catch (e) {
        const err = e as Error;
        res.status(404).json(err);
    }
});

router
    .route("/users")
    .get(async (req, res) => {
        // 회원 개별 조회
        try {
            const { email }: User = req.body;
            const sql = "SELECT * FROM `users` WHERE `email`=?";
            const values = [email];
            const [results] = await mariadb.query<RowDataPacket[]>(sql, values);
            if (results.length) {
                res.json(results);
            } else {
                notFoundUser(res);
            }
        } catch (e) {
            const err = e as Error;
            res.status(404).json(err);
        }
    })
    .delete(async (req, res) => {
        // 회원탈퇴
        try {
            const { email, password }: User = req.body;
            const sql = "DELETE FROM `users` WHERE `email`= ? AND `password`= ?";
            const values = [email, password];
            const [results] = await mariadb.query<ResultSetHeader>(sql, values);
            if (results.affectedRows) res.send(`${email}님 아쉽지만 다음에 또 만나요 😢`);
            else notFoundUser(res);
        } catch (e) {
            const err = e as Error;
            res.status(404).json(err);
        }
    });

function notFoundUser(res: Response) {
    res.status(404).send("회원을 찾을 수 없습니다");
}
export default router;
