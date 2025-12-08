import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.ts"
import adminRoutes from "./routes/admin.routes.ts"
// import prisma from "./config/prisma.ts"
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

// Employees API
app.use("/api/employee", Employee);

// app.get("/", async (req, res) => {
//     const users = await prisma.user.findMany();
//     res.json(users);
// });

app.listen(PORT, ()=>{
    console.log("Server running on:" + PORT)
})

