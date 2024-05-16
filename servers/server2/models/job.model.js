class Job {
    constructor(id, title, company, working_model, location, level, skills, salary, description, country, working_days, overtime_policy, posted_day, expired_day) {
        this.id = id;
        this.title = title;
        this.company = company;
        this.working_model = working_model;
        this.location = location;
        this.level = level;
        this.skills = skills;
        this.salary = salary;
        this.description = description;
        this.country = country;
        this.working_days = working_days;
        this.overtime_policy = overtime_policy;
        this.posted_day = posted_day;
        this.expired_day = expired_day;
    }
}

module.exports = Job;
