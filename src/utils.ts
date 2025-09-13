import { check } from 'k6';

export interface TestConfig {
    baseUrl: string;
    vus: number;
    duration: string;
    thresholds: { [key: string]: string[] };
}

export function performHealthCheck(baseUrl: string): void {
    const response = import('k6/http').then(http => http.get(`${baseUrl}/health`));
    // Note: This is simplified; in real K6, use proper import
}

export function validateResponse(response: any, expectedStatus: number = 200): boolean {
    return check(response, {
        [`status is ${expectedStatus}`]: (r) => r.status === expectedStatus,
        'response time < 1000ms': (r) => r.timings.duration < 1000,
    });
}