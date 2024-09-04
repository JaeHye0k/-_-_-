# 4주차-파트 1: 백엔드 기초: Node.js + Express 기본 (5)

수강 날짜: 2024년 9월 3일

## Map 에서 추출한 객체에 프로퍼티 추가하기 + 유튜버 실습

```jsx
const express = require("express");
const app = express();

app.get("/", function (req, res) {
    res.json("Hello World");
});

app.listen(3000);

const youtubers = new Map();
youtubers.set(1, {
    channel: "@syukaworld",
    channelTitle: "슈카월드",
    subscriptors: "336만명",
    videoCount: "1.7천개",
});
youtubers.set(2, {
    channel: "@codingapple",
    channelTitle: "코딩애플",
    subscriptors: "30만명",
    videoCount: "227개",
});
youtubers.set(3, {
    channel: "@ZeroChoTV",
    channelTitle: "ZeroCho TV",
    subscriptors: "4.33만명",
    videoCount: "1.3천개",
});

app.get("/youtubers/:id", function (req, res) {
    const id = +req.params.id;
    if (youtubers.has(id)) {
        const youtuber = youtubers.get(id);
        youtuber.id = id;
        res.json(youtuber);
    } else {
        res.status(404).send("Not Found Page");
    }
});
```

## express generator

https://expressjs.com/ko/starter/generator.html

![image.png](image.png)

views 폴더에 저장된 .pug 파일들은 뭘까?

### Pug

pug 는 자바스크립트를 이용해서 HTML 을 렌더링 할 수 있게 해주는 템플린 엔진이다.

pug 문법으로 코드를 작성하면 자바스크립트 엔진에 의해 해석되어 HTML 로 렌더링 된다.

```jsx
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
```

app.js 를 보면 앱에 해당 뷰 엔진을 pug로 설정해주는 걸 볼 수 있다.

## express 구조

**express-generator 구조**

```bash
.
├── app.js
├── bin
│   └── www
├── package.json
├── public
│   ├── images
│   ├── javascripts
│   └── stylesheets
│       └── style.css
├── routes
│   ├── index.js
│   └── users.js
└── views
    ├── error.pug
    ├── index.pug
    └── layout.pug
```

-   `app.js` : 미들웨어, 뷰, 라우트를 앱에 연결하는 등, 앱에 대한 설정을 진행한다.

    ```jsx
    var createError = require("http-errors");
    var express = require("express");
    var path = require("path");
    var cookieParser = require("cookie-parser");
    var logger = require("morgan");

    var indexRouter = require("./routes/index");
    var usersRouter = require("./routes/users");

    var app = express();

    // view engine setup
    app.set("views", path.join(__dirname, "views")); // 앱의 뷰로 사용할 디랙토리를 설정한다.
    app.set("view engine", "pug"); // 뷰 엔진의 확장자를 설정한다.

    app.use(logger("dev"));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, "public")));

    app.use("/", indexRouter);
    app.use("/users", usersRouter);

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        next(createError(404));
    });

    // error handler
    app.use(function (err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get("env") === "development" ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render("error");
    });

    module.exports = app;
    ```

-   `bin/www` : http 연결을 수립한다. 해당 파일을 실행 시켜야 [localhost](http://localhost) 에 접속이 가능하다.

    ```jsx
    #!/usr/bin/env node

    /**
     * Module dependencies.
     */

    var app = require("../app");
    var debug = require("debug")("myapp:server");
    var http = require("http");

    /**
     * Get port from environment and store in Express.
     */

    var port = normalizePort(process.env.PORT || "3000");
    app.set("port", port);

    /**
     * Create HTTP server.
     */

    var server = http.createServer(app);

    /**
     * Listen on provided port, on all network interfaces.
     */

    server.listen(port);
    server.on("error", onError);
    server.on("listening", onListening);

    /**
     * Normalize a port into a number, string, or false.
     */

    function normalizePort(val) {
        var port = parseInt(val, 10);

        if (isNaN(port)) {
            // named pipe
            return val;
        }

        if (port >= 0) {
            // port number
            return port;
        }

        return false;
    }

    /**
     * Event listener for HTTP server "error" event.
     */

    function onError(error) {
        if (error.syscall !== "listen") {
            throw error;
        }

        var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case "EACCES":
                console.error(bind + " requires elevated privileges");
                process.exit(1);
                break;
            case "EADDRINUSE":
                console.error(bind + " is already in use");
                process.exit(1);
                break;
            default:
                throw error;
        }
    }

    /**
     * Event listener for HTTP server "listening" event.
     */

    function onListening() {
        var addr = server.address();
        var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
        debug("Listening on " + bind);
    }
    ```

-   `public` : 프론트에서 필요한 데이터를 저장한다.
-   `routes` : 라우터를 저장한다.
    `routes/index.js`

    ```jsx
    var express = require("express");
    var router = express.Router();

    /* GET home page. */
    router.get("/", function (req, res, next) {
        // view를 렌더링 하고 렌더링된 HTML 문자열을 클라이언트에게 전송한다.
        // 두 번째 매개변수로 전달되는 객체는 view 에서 사용할 변수다.
        res.render("index", { title: "Express" });
    });

    module.exports = router;
    ```

    `routes/users.js`

    ```jsx
    var express = require("express");
    var router = express.Router();

    /* GET users listing. */
    /*
    경로가 '/' 로 설정되어있지만 app에 연결될 때,
    app.use('/users', usersRouter); 
    이렇게 연결되기 때문에 '/users' 에 접속했을 때 콜백 함수가 실행된다.
    */
    router.get("/", function (req, res, next) {
        res.send("respond with a resource");
    });

    module.exports = router;
    ```

-   `views` : view 를 저장한다.

**그 외의 구조**

-   [Route listings](https://github.com/expressjs/express/blob/4.13.1/examples/route-separation/index.js#L32-47)
-   [Route map](https://github.com/expressjs/express/blob/4.13.1/examples/route-map/index.js#L52-L66)
-   [MVC style controllers](https://github.com/expressjs/express/tree/master/examples/mvc)
-   [Resourceful routing](https://github.com/expressjs/express-resource)

### 참고자료

---

https://inpa.tistory.com/entry/PUG-📚-템플릿-엔진-html

https://expressjs.com/ko/starter/generator.html

https://expressjs.com/ko/starter/faq.html - **애플리케이션을 어떻게 구조화해야 합니까?**

https://expressjs.com/en/api.html#app.set - **app.set()**

https://expressjs.com/en/api.html#res.render - **res.render()**
