import http from 'k6/http';
import { check, sleep } from 'k6';

// Test configuration for frontend assets validation
export let options = {
    vus: 5,
    duration: '20s',

    thresholds: {
        http_req_duration: ['p(95)<800'],
        http_req_failed: ['rate<0.05'],
    },
};

const BASE_URL = __ENV.BASE_URL || 'https://quickpizza.grafana.com';

export default function () {
    // Test frontend assets that are actually available
    const assets = [
        '/',
        '/images/pizza.png',
        '/_app/immutable/assets/0.56795cc5.css',
        '/_app/immutable/assets/4.1bdb0f28.css',
        '/_app/immutable/entry/start.865d8e2a.js',
        '/_app/immutable/entry/app.740100b1.js',
        '/_app/immutable/chunks/index.98b0eb20.js',
        '/_app/immutable/chunks/singletons.49a5e4a4.js',
        '/_app/immutable/chunks/index.2793c3c9.js',
        '/_app/immutable/nodes/0.801da58d.js',
        '/_app/immutable/nodes/4.8e3d4ca0.js'
    ];

    for (const asset of assets) {
        const response = http.get(`${BASE_URL}${asset}`);

        check(response, {
            [`${asset} status is 200`]: (r) => r.status === 200,
            [`${asset} response time < 800ms`]: (r) => r.timings.duration < 800,
            [`${asset} has content`]: (r) => !!(r.body && typeof r.body === 'string' && r.body.length > 0),
        });

        sleep(0.5);
    }

    // Test different user agents to simulate various devices
    const userAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1'
    ];

    for (const ua of userAgents) {
        const response = http.get(`${BASE_URL}/`, {
            headers: {
                'User-Agent': ua
            }
        });

        check(response, {
            [`${ua.split(' ')[0]} user agent works`]: (r) => r.status === 200,
        });

        sleep(0.3);
    }
}

export function setup() {
    console.log('🔍 Starting QuickPizza frontend asset validation test...');
    console.log('📋 Testing all available static assets and user agents');
}

export function teardown() {
    console.log('✅ Frontend asset validation completed.');
}