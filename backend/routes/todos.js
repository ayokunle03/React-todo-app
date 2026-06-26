import { Router } from "express";
import Pool from "../db.js";

const router = Router();


// create a  new todo
router.post("/", async (req, res) => {
    try {
        const { description, completed } = req.body;

        const newTodo = await Pool.query(
            "INSERT INTO todos (description, completed) VALUES ($1, $2) RETURNING *",
            [description, completed || false]
        );

        res.json(newTodo.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// Get all todos
router.get("/", async (req, res) => {
    try {
        const allTodos = await Pool.query("SELECT * FROM todos");
        res.json(allTodos.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

//Update a todo
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { description, completed } = req.body;

        const updatedTodo = await Pool.query(
            "UPDATE todos SET description = $1, completed = $2 WHERE todo_id = $3 RETURNING *",
            [description, completed, id]
        );

        if (updatedTodo.rows.length === 0) {
            return res.status(404).send("Todo not found");
        }

        res.json({
            message: "Todo updated successfully",   
            todo: updatedTodo.rows[0]
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// Delete a todo
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const deletedTodo = await Pool.query(
            "DELETE FROM todos WHERE todo_id = $1 RETURNING *",
            [id]
        );

        if (deletedTodo.rows.length === 0) {
            return res.status(404).send("Todo not found");
        }

        res.json({
            message: "Todo deleted successfully"
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

export default router;