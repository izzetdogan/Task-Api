const express = require('express');
const taskControllers = require('../controller/task-controller');
const router = express.Router();
const auth = require('../middleware/auth');

router.post('/',auth,taskControllers.postTask);
router.get('/',auth,taskControllers.getTask);
router.get('/:tid',auth,taskControllers.getTaskById)
router.patch('/:tid',taskControllers.updateTask)
router.delete('/:tid',taskControllers.deleteTask)

module.exports = router;