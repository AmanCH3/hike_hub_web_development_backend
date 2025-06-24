const express = require("express")
const router  = express.Router()
const groupController = require("../controllers/admin/group.controller")
const { protect, admin } = require("../middlewares/auth.middleware");



router.post('/create' , groupController.createGroups)
router.get('' , groupController.getAll) ;
router.get('/:id' , groupController.getGroupById) ;
router.put('/:id' , groupController.updateGroup) ;
router.delete('/id' , groupController.deletegroup ) ;
router.post('/:id/request-join', protect, groupController.requestToJoinGroup);
router.post('/:groupId/requests/:requestId/approve', protect, admin, groupController.approveJoinRequest);
router.post('/:groupId/requests/:requestId/deny', protect, admin, groupController.denyJoinRequest);

module.exports = router ;
