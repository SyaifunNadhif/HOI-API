const router = require("express").Router();
const {regulation} = require('../controllers');
const jwt = require('../middlewares/requireLogin');

router.post('/createdata/', jwt.protected,  regulation.createData);
router.delete('/deletedata/:id', jwt.protected, regulation.deleteData);
router.put('/updatedata/:id', jwt.protected, regulation.updateData);
router.get('/alldata/', regulation.getAll);



module.exports = router;