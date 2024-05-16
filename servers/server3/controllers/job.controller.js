const fs = require('fs');
const Job = require('../models/job.model');

let jobs = require('../db/jobs.json');

function saveJobsToFile() {
    fs.writeFile('./db/jobs.json', JSON.stringify(jobs, null, 2), err => {
        if (err) {
            console.error('Error saving jobs to file:', err);
        } else {
            console.log('Jobs saved to file');
        }
    });
}

function getAllJobs(req, res) {
    res.json(jobs);
}

function getJobInfo(req, res) {
    const jobId = req.params.id;
    const job = jobs.find(job => job.id === parseInt(jobId));
    if (job) {
        res.json(job);
    } else {
        res.status(404).json({ message: "Job not found" });
    }
}

function createJob(req, res) {
    const { title, company, working_model, location, level, skills, salary, description, country, working_days, overtime_policy, expired_day } = req.body;
    const posted_day = new Date().toISOString().slice(0, 10);
    const id = jobs.length + 1;
    const newJob = new Job(id, title, company, working_model, location, level, skills, salary, description, country, working_days, overtime_policy, posted_day, expired_day);
    jobs.push(newJob);
    saveJobsToFile();
    res.status(201).json(newJob);
}

function updateJob(req, res) {
    const jobId = req.params.id;
    const { title, company, working_model, location, level, skills, salary, description, country, working_days, overtime_policy, expired_day } = req.body;
    const jobIndex = jobs.findIndex(job => job.id === parseInt(jobId));
    if (jobIndex !== -1) {
        jobs[jobIndex].title = title || jobs[jobIndex].title;
        jobs[jobIndex].company = company || jobs[jobIndex].company;
        jobs[jobIndex].working_model = working_model || jobs[jobIndex].working_model;
        jobs[jobIndex].location = location || jobs[jobIndex].location;
        jobs[jobIndex].level = level || jobs[jobIndex].level;
        jobs[jobIndex].skills = skills || jobs[jobIndex].skills;
        jobs[jobIndex].salary = salary || jobs[jobIndex].salary;
        jobs[jobIndex].description = description || jobs[jobIndex].description;
        jobs[jobIndex].country = country || jobs[jobIndex].country;
        jobs[jobIndex].working_days = working_days || jobs[jobIndex].working_days;
        jobs[jobIndex].overtime_policy = overtime_policy || jobs[jobIndex].overtime_policy;
        jobs[jobIndex].expired_day = expired_day || jobs[jobIndex].expired_day;
        saveJobsToFile();
        res.json(jobs[jobIndex]);
    } else {
        res.status(404).json({ message: "Job not found" });
    }
}

function deleteJob(req, res) {
    const jobId = req.params.id;
    const jobIndex = jobs.findIndex(job => job.id === parseInt(jobId));
    if (jobIndex !== -1) {
        jobs = jobs.filter(job => job.id !== parseInt(jobId));
        saveJobsToFile();
        res.json({ message: "Job deleted successfully" });
    } else {
        res.status(404).json({ message: "Job not found" });
    }
}

function searchJobs(req, res) {
    const { keyword } = req.body;

    let filteredJobs = jobs.filter(job => {
        if (job.company.name.toLowerCase().includes(keyword.toLowerCase())) {
            return true;
        }
        if (job.company.type.toLowerCase().includes(keyword.toLowerCase())) {
            return true;
        }
        if (job.skills.some(skill => skill.toLowerCase().includes(keyword.toLowerCase()))) {
            return true;
        }
        const jobData = Object.values(job).map(value => value.toString().toLowerCase());
        return jobData.some(data => data.includes(keyword.toLowerCase()));
    });

    if (filteredJobs.length > 0) {
        res.json(filteredJobs);
    } else {
        res.status(404).json({ message: "Job not found" });
    }
}

module.exports = {
    getAllJobs,
    getJobInfo,
    createJob,
    updateJob,
    deleteJob,
    searchJobs
};
