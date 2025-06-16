const express = require("express")
const router  = express.Router()
const groupController = require("../controllers/admin/group.controller")


router.post('/create' , groupController.createGroups)
router.get('' , groupController.getAll) ;
router.get('/:id' , groupController.getGroupById) ;
router.put('/:id' , groupController.updateGroup) ;
router.delete('/id' , groupController.deletegroup ) ;

module.exports = router ;