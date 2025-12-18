import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.ts"
import adminRoutes from "./routes/admin.routes.ts"
import employeeRoutes from "./routes/employee.routes.ts"
import Employee from "./routes/employee/index.ts";



dotenv.config();

const app= express();
const PORT: number = Number(process.env.PORT) || 5002;
app.use(cookieParser());
app.use(cors({
    origin: true,
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/employee", employeeRoutes);

// Employees API
app.use("/api/employee", Employee);

app.use((req, _res, next) => {
    console.log("BODY:", req.body);
    next();
});

app.listen(PORT, ()=>{
    console.log("Server running on:" + PORT)
})

