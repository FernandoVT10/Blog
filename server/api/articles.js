import { Router } from "express";

const router = Router();

router.get("/test/", (req, res) => {
    res.json({
        hola: "Hola mundo"
    });
});

export default router;