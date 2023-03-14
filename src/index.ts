import app from "./app";
import { bandsRouter } from "./routes/bandsRouter";
import { userRouter } from "./routes/userRouter";

app.use("/user", userRouter)
app.use("/bands", bandsRouter)