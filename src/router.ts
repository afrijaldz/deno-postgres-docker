import { Router } from "oak";
import * as UserController from "./controllers/users.controller.ts";

const router = new Router();

router.get("/", UserController.hello);
router.get("/users", UserController.all);
router.post("/users", UserController.createUser);

export default router;
