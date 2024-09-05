# 4주차-파트 1: 백엔드 기초: Node.js + Express 기본 (7)

수강 날짜: 2024년 9월 5일

## Map 객체를 JSON으로!

```jsx
const db = new Map();

app.get("/youtubers", (req, res) => {
    res.json(Object.fromEntries(db));
});
```

## Array.prototype.foreach()

`foreach` 메서드는 `undefined`를 반환한다.

```jsx
arr.forEach(callbackFn[, thisArg]);

function callbackFn(element[, index[, array]]) { ... }
```

https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach

## Array.prototype.map()

`map` 메서드는 배열을 반환한다.

```jsx
arr.map(callback[, thisArg])

function callbackFn(element[, index[, array]]) { ... }
```

https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/map#currentvalue

## DELETE

```jsx
// 개별 유튜버 삭제
app.delete("/youtubers/:id", (req, res) => {
    const id = +req.params.id;
    const youtuber = youtubers.get(id);
    if (youtuber) {
        youtubers.delete(id);
        res.send(`${youtuber.channelTitle}님, 아쉽지만 다음에 또 만나요`);
        console.log(youtubers);
    } else {
        res.status(404).send(`요청하신 ${id}번 유튜버를 찾을 수 없습니다.`);
    }
});

// 전체 유튜버 삭제
app.delete("/youtubers", (req, res) => {
    if (youtubers.size) {
        youtubers.clear();
        // const star = String.fromCharCode(parseInt("2B50", 16)); // ⭐
        res.send(`계⭐정⭐폭⭐파`);
    } else {
        res.status(404).send("삭제할 계정이 없습니다.");
    }
});
```

## PUT

```jsx
app.put("/youtubers/:id", (req, res) => {
    const id = +req.params.id;
    const youtuber = youtubers.get(id);
    if (youtuber) {
        const preChannelTitle = youtuber.channelTitle;
        const newChannelTitle = req.body.channelTitle;
        youtuber.channelTitle = newChannelTitle;
        youtubers.set(id, youtuber);
        res.send(`채널명 '${preChannelTitle}' 이(가) '${newChannelTitle}' (으)로 변경되었습니다.`);
    } else {
        res.status(404).send(`요청하신 ${id}번 유튜버를 찾을 수 없습니다.`);
    }
});
```

## HTTP 상태 코드

-   1xx (정보): 요청을 받았으며 프로세스를 계속한다
-   2xx (성공): 요청을 성공적으로 받았으며 인식했고 수용하였다
-   3xx (리다이렉션): 요청 완료를 위해 추가 작업 조치가 필요하다
-   4xx (클라이언트 오류): 요청의 문법이 잘못되었거나 요청을 처리할 수 없다
-   5xx (서버 오류): 서버가 명백히 유효한 요청에 대해 충족을 실패했다

https://ko.wikipedia.org/wiki/HTTP_상태_코드

https://developer.mozilla.org/ko/docs/Web/HTTP/Status

## 리팩토링

소프트웨어의 코드 내부 구조를 변경하는 것.

**하는 이유**

1. 가독성 증진
2. 성능 향상
3. 안정성 증가

**언제 해야 할까?**

1. 에러(문제점)이 발견되었을 때
2. 기능을 추가하기 전
3. 코드를 읽기 힘들때

📌 배포, 운영 직전에는 절대로 코드 수정이 일어나선 안된다!!!
