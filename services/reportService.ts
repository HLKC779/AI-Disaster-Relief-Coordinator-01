import { UserReport } from '../types';

const REPORTS_STORAGE_KEY = 'userReports';

/**
 * Fetches reports from the browser's localStorage.
 * @returns A promise that resolves to an array of stored user reports.
 */
export const fetchReports = (): Promise<UserReport[]> => {
    try {
        const reportsJSON = localStorage.getItem(REPORTS_STORAGE_KEY);
        const reports = reportsJSON ? JSON.parse(reportsJSON) : [];
        return Promise.resolve(reports);
    } catch (error) {
        console.error("Failed to parse reports from localStorage", error);
        return Promise.resolve([]);
    }
};

/**
 * Submits a new report, saving it to the browser's localStorage.
 * @param report The UserReport object to save.
 * @returns A promise that resolves with the saved report.
 */
export const submitReport = (report: UserReport): Promise<UserReport> => {
    try {
        const reports = JSON.parse(localStorage.getItem(REPORTS_STORAGE_KEY) || '[]');
        // Add the new report to the beginning of the array
        reports.unshift(report);
        localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports));
        return Promise.resolve(report);
    } catch (error) {
        console.error("Failed to save report to localStorage", error);
        return Promise.reject(error);
    }
};