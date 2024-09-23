# 6주차-파트 1 백엔드 심화: 인증과 비동기처리(4)

수강 날짜: 2024년 9월 23일

## db 모듈화

강의에서는 CJS 방식을 사용했지만 나는 ESM 방식을 사용했다.

```tsx
// mariadb.ts
import mysql from "mysql2/promise";

// Create the connection to database
const connection = await mysql.createConnection({
    host: "localhost",
    password: "root",
    user: "root",
    database: "Youtube",
    dateStrings: true,
});

export default connection;
```

```tsx
// users.ts
import express from "express";
import { RowDataPacket } from "mysql2/promise";
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
```

## 유튜브 미니 프로젝트

### 설계

**기능 요구사항**

```markdown
-   회원
    -   가입
    -   탈퇴
    -   개인 정보 수정
        채널 ( 1인당 최대 100개까지 생성 가능)
        -   생성
        -   삭제
        -   채널 정보 수정
        -   조회
```

**회원**

-   [x] 로그인 : **POST /login → SELECT**
    -   req : body (email, password)
    -   res : `${name}님, 환영합니다` → 메인페이지 (리다이렉트)
      <aside>
      💡
      
      로그인 시 데이터는 URL에 표시되면 안되는 민감한 정보이기 때문에 Body에 담아보내야한다. 따라서 GET 대신 POST 를 사용한다.
      
      [GET 요청은 body를 가질 수 없는 이유](https://www.notion.so/GET-body-60b203a0947f4d34aa747b97a1db86fa?pvs=21)
      
      </aside>

-   [x] 회원가입 : **POST /join → INSERT**
    -   req : body(email, password, name, tel)
    -   res : 🎉${name}님 환영합니다🎉 → 로그인 페이지 (리다이렉트)
-   [x] 회원 개별 조회: **GET /users → SELECT**
    -   req : body(email)
    -   res : 회원 객체
-   [x] 회원 탈퇴 : **DELETE /users → DELETE**
    -   req : body(email, password)
    -   res : “${email}님 아쉽지만 다음에 또 만나요 😢” → 메인 페이지 (리다이렉트)

**채널**

-   [x] 채널 생성 : **POST /channels → INSERT**
    -   req : body (name, **user_Id**)
    -   res : ‘${name}님 채널을 응원합니다.’ (201)
    -   이미 존재하는 회원의 채널을 생성한다고 가정
-   [x] 채널 삭제 : **DELETE /channels/:id → DELETE, SELECT**
    -   req : URL(id)
    -   res : ‘${name}님 아쉽지만 다음에 또 만나요 😢’ → 메인 페이지 (리다이렉트) (200)
-   [x] 채널 개별 조회 : **GET /channels/:id → SELECT**
    -   req : URL(id)
    -   res : 채널 데이터 (200)
-   [x] 개별 회원의 전체 채널 조회 : **GET /channels → SELECT**
    -   req : body (**Id**)
    -   res : 채널 리스트 (200)
-   [x] 채널 정보 수정 : **PUT /channels/:id → UPDATE**
    -   req : body(name)
    -   res : ‘채널명이 ${preChannelTitle}에서 ${newChannelTitle} 로 변경되었습니다.’ (200)

### DB Diagram

![youtube (2).png](<youtube_(2).png>)

### 구현

**회원**

```tsx
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
```

```tsx
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
```

```tsx
// 회원 개별 조회
route.get("/users", async (req, res) => {
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
});
```

```tsx
// 회원탈퇴
route.delete("/users", async (req, res) => {
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
```

**채널**

```tsx
// 채널 생성
router.post("/", async (req, res) => {
    try {
        const { name, user_id }: Channel = req.body;
        const sql = "INSERT INTO `channels` (??) VALUES (?)";
        const cols = ["name", "user_id"];
        const values = [name, user_id];
        await mariadb.query<ResultSetHeader>(sql, [cols, values]);
        res.status(201).send(`${name}님, 채널을 응원합니다`);
    } catch (e) {
        const err = e as Error;
        res.status(400).json(err);
    }
});
```

```tsx
// 채널 전체 조회
router.get("/", async (req, res) => {
    try {
        const { user_id }: Channel = req.body;
        // 1) 유저 id 가 전달되지 않은 경우
        if (!user_id) {
            res.status(400).send("로그인이 필요한 페이지 입니다.");
            return;
        }

        const sql = "SELECT * FROM `channels` WHERE `user_id`= ?";
        const values = [user_id];
        const [channels] = await mariadb.query<RowDataPacket[]>(sql, values);

        // 2) userId가 가진 채널이 없는 경우
        if (channels.length) res.json(channels);
        else notFoundChannel(res);
    } catch (e) {
        const err = e as Error;
        res.status(400).json(err);
    }
});
```

```tsx
// 채널 개별 조회
router.get("/:id", async (req, res) => {
    try {
        const id = +req.params.id;
        const sql = "SELECT * FROM `channels` WHERE `id`= ?";
        const values = [id];
        const [results] = await mariadb.query<RowDataPacket[]>(sql, values);
        const channel = results[0];
        if (channel) {
            res.json(channel);
        } else {
            notFoundChannel(res);
        }
    } catch (e) {
        const err = e as Error;
        res.json(err);
    }
});
```

```tsx
// 채널 삭제
router.delete("/:id", async (req, res) => {
    try {
        const id = +req.params.id;
        const deleteSql = "DELETE FROM `channels` WHERE `id`= ?";
        const selectSql = "SELECT `name` FROM `channels` WHERE `id`= ?";
        const values = [id];
        const [results] = await mariadb.query<RowDataPacket[]>(selectSql, values);
        const channel = results[0];
        if (results.length) {
            await mariadb.query<ResultSetHeader>(deleteSql, values);
            res.send(`${channel.name}님, 아쉽지만 다음에 또 만나요 😢`);
        } else notFoundChannel(res);
    } catch (e) {
        const err = e as Error;
        res.status(400).json(err);
    }
});
```

```tsx
// 채널 정보 수정
router.put("/:id", async (req, res) => {
    try {
        const id = +req.params.id;
        const sql = "SELECT `name` FROM `channels` WHERE `id`= ?";
        const values = [id];
        const [results] = await mariadb.query<RowDataPacket[]>(sql, values);
        const channel = results[0];

        if (channel) {
            const oldChannelName: string = channel.name;
            const newChannelName: string = req.body.name;
            const sql = "UPDATE `channels` SET `name` = ? WHERE `id`= ?";
            const values = [newChannelName, id];
            await mariadb.query<ResultSetHeader>(sql, values);
            res.send(
                `채널명이 '${oldChannelName}' 에서 '${newChannelName}' (으)로 변경되었습니다.`,
            );
        } else {
            notFoundChannel(res);
        }
    } catch (e) {
        const err = e as Error;
        res.status(400).json(err);
    }
});
```

## 리팩토링

-   **변수명 적절하게 짓기**
-   **주석은 필수가 아니다.**
    주석은 코드로 설명하지 못하는 부분에 작성하는 것이다. 만약 코드로 설명하지 못하는 부분이 존재한다면 우선 코드로 설명할 수 있도록 최대한 고쳐보고 그럼에도 불구하고 설명이 안되는 부분만 주석으로 설명하자.
-   **개행은 최대 두 줄**
-   **하드코딩된 데이터 변수로 분리 (데이터에 이름 짓기)**

### 참고자료

---

https://sidorares.github.io/node-mysql2/docs/documentation/typescript-examples#resultsetheader
