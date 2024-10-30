import React from "react";
import "./App.css";

function App() {
    const text = "리액트";
    const style = {
        backgroundColor: "green",
        padding: 20,
        fontSize: "3rem",
        color: "white",
    };
    return (
        <>
            <div>
                <h1 style={style}>Hello, {text}!</h1>
                <p>반갑습니다.</p>
            </div>
        </>
    );
}

// function App() {
//     const div = React.createElement(
//         "div",
//         null,
//         React.createElement("h1", null, "Hello, 리액트!"),
//         React.createElement("p", null, "반갑습니다."),
//     );

//     return div;
// }

export default App;
