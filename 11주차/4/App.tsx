import "./App.css";
import ClassCom from "./ClassCom";
import Clock from "./Clock";
import FuncCom from "./FuncCom";
import Timer from "./Timer";
import Todos from "./Todos";

function App() {
    const text = "리액트";
    const style = {
        backgroundColor: "green",
        padding: 20,
        fontSize: "3rem",
        color: "white",
    };
    return (
        <div className="container">
            <Todos />
            <Clock />
            {/* <Timer /> */}
        </div>
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
