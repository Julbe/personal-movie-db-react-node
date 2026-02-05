import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
    res.json({
        status: "OK",
        service: "Personal Movie DB API.",
        time: new Date(),
    });
});



export default app;
