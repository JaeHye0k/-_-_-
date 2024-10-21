function f1() {
    console.log("f1");
}
f1(); // 일반함수

const f2 = function () {
    console.log("f2");
};
f2(); // 익명함수

const f3 = function func() {
    console.log("f3");
};
f3(); // 기명함수

const f4 = () => {
    console.log("f4");
};
f4(); // 화살표 함수

function f5(arg) {
    if (arg === 3) return;
    console.log(arg++);
}
f5(0); // 재귀함수

function f6(callback) {
    callback();
}
f6(f1); // 콜백함수

(function f7() {
    console.log("f7");
})(); // 즉시 실행 함수(IIFE)

function f8() {
    const a = 1;
    function f9() {
        console.log(a);
    }
    f9();
}
f8(); // 중첩함수

const f10 = new Function("console.log('f10')"); // Function 생성자 함수
