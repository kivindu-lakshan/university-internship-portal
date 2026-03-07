import api from './api';

export const searchJobs = async ({ q, jobType, location, minSalary, maxSalary }) => {
    const response = await api.get('/jobs/search', {
        params: {
            q,
            jobType,
            location,
            minSalary,
            maxSalary
        }
    });
    return response.data.jobs;
};

export const getRecommendedJobs = async () => {
    const response = await api.get('/jobs/recommended');
    return response.data.jobs;
};

export const saveJob = async (jobId) => {
    const response = await api.post('/jobs/save', { jobId });
    return response.data.savedJob;
};

export const getSavedJobs = async () => {
    const response = await api.get('/jobs/saved');
    return response.data.savedJobs;
};

export const removeSavedJob = async (savedJobId) => {
    const response = await api.delete(`/jobs/save/${savedJobId}`);
    return response.data;
};
