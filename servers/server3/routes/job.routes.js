const express = require('express');
const router = express.Router();
const jobController = require('../controllers/job.controller');

router.get('/jobs', jobController.getAllJobs);
router.get('/jobs/:id', jobController.getJobInfo);
router.post('/jobs', jobController.createJob);
router.put('/jobs/:id', jobController.updateJob);
router.delete('/jobs/:id', jobController.deleteJob);
router.post('/jobs/search', jobController.searchJobs);

module.exports = router;
