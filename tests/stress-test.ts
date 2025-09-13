import http from 'k6/http';
import { check, sleep } from 'k6';

// Stress test configuration for frontend
export let options = {
    stages: [
        { duration: '10s', target: 10 }, // Ramp up to 10 users
        { duration: '30s', target: 50 }, // Ramp up to 50 users
        { duration: '20s', target: 100 }, // Peak load
        { duration: '10s', target: 0 }, // Ramp down
    ],

    thresholds: {
        http_req_duration: ['p(95)<2000'], // Allow higher latency under stress
        http_req_failed: ['rate<0.2'], // Allow some failures under stress
    },
};

const BASE_URL = __ENV.BASE_URL || 'https://quickpizza.grafana.com';

export default function () {
    // Stress test the homepage under heavy load
    const response = http.get(`${BASE_URL}/`);

    check(response, {
        'stress test - homepage accessible': (r) => r.status === 200,
        'stress test - response time acceptable': (r) => r.timings.duration < 2000,
        'stress test - contains pizza content': (r) => !!(r.body && typeof r.body === 'string' && (r.body.includes('pizza') || r.body.includes('Pizza'))),
    });

    // Test critical assets under stress
    const criticalAssets = [
        '/_app/immutable/assets/0.56795cc5.css',
        '/_app/immutable/entry/start.865d8e2a.js'
    ];

    for (const asset of criticalAssets) {
        const assetResponse = http.get(`${BASE_URL}${asset}`);
        check(assetResponse, {
            ['stress test - ' + asset + ' loads under load']: (r) => r.status === 200,
        });
    }

    // Simulate realistic user behavior under stress
    // Random delay to simulate thinking time
    sleep(Math.random() * 2 + 0.5);

    // Additional homepage request to simulate navigation
    const navResponse = http.get(`${BASE_URL}/`);
    check(navResponse, {
        'stress test - navigation works under load': (r) => r.status === 200,
    });

    sleep(Math.random() * 2 + 0.5);
}

export function setup() {
    console.log('⚡ Starting frontend stress test for QuickPizza...');
    console.log('📈 Will ramp up from 10 to 100 users testing homepage performance');
}

export function teardown() {
    console.log('💨 Frontend stress test completed.');
}