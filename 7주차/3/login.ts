export const login = async (req: Request, res: Response) => {
    try {
        const { email, password }: User = req.body;

        const sql = "SELECT * FROM `users` WHERE `email` = ?";
        const [results] = await mariadb.query<RowDataPacket[]>(sql, email);
        const user = results[0] as User;

        const hashedPassword = crypto
            .pbkdf2Sync(password, user.salt, 10000, 10, "sha512")
            .toString("base64");

        if (user.password === hashedPassword) {
            // JWT 발행
            if (user) {
                const payload = { ...user };
                const options: SignOptions = {
                    expiresIn: "10m",
                    issuer: "JaeHyeok",
                };
                if (privateKey) {
                    const token = jwt.sign(payload, privateKey, options);
                    res.cookie("token", token, { httpOnly: true });
                    res.json(user);
                }
            } else {
                res.status(httpStatusCode.UNAUTHORIZED).json({
                    message: "아이디 또는 비밀번호를 확인해주세요",
                });
            }
        }
    } catch (e) {
        const error = e as Error;
        res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json(error);
    }
};
