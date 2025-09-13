import http from 'k6/http';
import { check, sleep } from 'k6';

// Test configuration
export let options = {
  vus: 10, // Number of virtual users
  duration: '30s', // Test duration

  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
    http_req_failed: ['rate<0.1'], // Error rate should be below 10%
  },
};

const BASE_URL = __ENV.BASE_URL || 'https://httpbin.org';

export default function () {
  // Simulate a user visiting the homepage
  let response = http.get(`${BASE_URL}/get`);

  // Check response
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });

  // Simulate some processing time
  sleep(Math.random() * 2 + 1); // Sleep between 1-3 seconds
}

// Setup function - runs before the test starts
export function setup() {
  console.log('Starting load test...');
}

// Teardown function - runs after the test ends
export function teardown() {
  console.log('Load test completed.');
}