import app from "./app";
import { bandsRouter } from "./routes/bandsRouter";
import { showsRouter } from "./routes/showsRouter";
import { userRouter } from "./routes/userRouter";

app.use("/user", userRouter)
app.use("/bands", bandsRouter)
app.use("/shows", showsRouter)