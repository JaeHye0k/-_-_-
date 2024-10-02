export const join = async (req: Request, res: Response) => {
    try {
        const { email, password }: User = req.body;
        const sql = "INSERT INTO `users` (??) VALUES (?)";
        // 비밀번호 암호화
        const salt = crypto.randomBytes(64).toString("base64");
        const hashedPassword = crypto
            .pbkdf2Sync(password, salt, 10000, 10, "sha512")
            .toString("base64");
        // 암호화된 비밀번호와 salt 를 DB에 저장
        const cols = ["email", "password", "salt"];
        const values = [email, hashedPassword, salt];
        const [results] = await mariadb.query<ResultSetHeader>(sql, [cols, values]);

        res.status(httpStatusCode.CREATED).json(results);
    } catch (e) {
        const error = e as Error;
        res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json(error);
    }
};
