import { app } from "./app.js";
import dbconnect from "./db/index.js";

console.log("Starting application..."); // Add this

dbconnect()
    .then(() => {
        console.log("DB connected, starting server..."); // Add this
        app.listen(process.env.PORT || 8000, () => {
            console.log(` Server is running at port ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.log(" MongoDB connection failed!!!", err);
    });