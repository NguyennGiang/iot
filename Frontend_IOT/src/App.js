import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import AppRouter from "./Router";
import "mapbox-gl/dist/mapbox-gl.css";

const App = () => {
    const [mode, setMode] = useState(true);
    const [show, setShow] = useState(false);

    window.addEventListener("offline", (e) => {
        console.log("offline", e);
        setMode(false);
    });

    window.addEventListener("online", (e) => {
        console.log("online", e);
        setShow(true);
        setTimeout(() => {
            setMode(true);
            setShow(false);
        }, 1500);
    });
    return (
        <div className="App">
            {!mode && (
                <div
                    style={{
                        padding: "0.5rem",
                        borderWidth: "1px",
                        position: "fixed",
                        zIndex: "100000",
                        top: 0,
                        width: "100%",
                        textAlign: "center",
                        justifyContent: "center",
                        color: "#916302",
                        backgroundColor: "#fffdf9",
                        borderColor: "#916302",
                    }}
                >
                    <strong>
                        {show
                            ? "Đã khôi phục kết nối"
                            : "Bạn đang offline, vui lòng kiểm tra lại kết nối"}{" "}
                    </strong>
                </div>
            )}
            <AppRouter />
            <ToastContainer />
        </div>
    );
};

export default App;
