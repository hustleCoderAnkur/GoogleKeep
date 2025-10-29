import { app } from "./app.js";
import dbconnect from "./src/db/index.js"
import userRouter from "./src/routes/user.route.js";
import notesRouter from "./src/routes/note.route.js"
import settingRouter from "./src/routes/setting.route.js"
import reminderRouter from "./src/routes/reminder.route.js"

app.use("/api/users", userRouter);
app.use("/api/notes", notesRouter);
app.use("/api/reminder", settingRouter);
app.use("/api/settings", reminderRouter);

console.log("Starting application...");

dbconnect()
    .then(() => {
        console.log("DB connected, starting server...");
        app.listen(process.env.PORT || 8000, () => {
            console.log(` Server is running at port ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.log(" MongoDB connection failed!!!", err);
    });