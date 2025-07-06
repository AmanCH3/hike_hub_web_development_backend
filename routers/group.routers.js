const express = require("express")
const router  = express.Router()
const groupController = require("../controllers/admin/group.controller")
const { protect, admin } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/fileUpload");



router.post('/create',protect,upload.array('photo',10) , groupController.createGroups)
router.get('/' , groupController.getAll) ;
router.get('/:id' , groupController.getGroupById) ;
router.put('/:id' ,protect, admin, groupController.updateGroup) ;
router.delete('/id',protect, admin , groupController.deletegroup ) ;
router.post('/:id/request-join', protect, groupController.requestToJoinGroup);
router.patch('/:groupId/requests/:requestId/approve', protect, admin, groupController.approveJoinRequest);
router.patch('/:groupId/requests/:requestId/deny', protect, admin, groupController.denyJoinRequest);
router.get(
  '/requests/pending',
  protect, 
  admin, 
  groupController.getAllPendingRequests
);
module.exports = router ;
