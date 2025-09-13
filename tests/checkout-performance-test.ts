import http from 'k6/http';
import { check, sleep } from 'k6';

// Performance test configuration for frontend
export let options = {
    vus: 20,
    duration: '45s',

    thresholds: {
        http_req_duration: ['p(95)<1000'],
        http_req_failed: ['rate<0.1'],
        'page_load_duration': ['p(95)<1500'], // Custom metric for page load
    },
};

const BASE_URL = __ENV.BASE_URL || 'https://quickpizza.grafana.com';

export default function () {
    const startTime = new Date().getTime();

    // Step 1: Load homepage (simulating user arriving at site)
    const homeResponse = http.get(`${BASE_URL}/`);
    check(homeResponse, {
        'performance - homepage loads fast': (r) => r.timings.duration < 800,
        'performance - homepage accessible': (r) => r.status === 200,
        'performance - homepage has content': (r) => !!(r.body && typeof r.body === 'string' && r.body.length > 0),
    });

    sleep(0.5);

    // Step 2: Load critical CSS (simulating style loading)
    const cssResponse = http.get(`${BASE_URL}/_app/immutable/assets/0.56795cc5.css`);
    check(cssResponse, {
        'performance - CSS loads fast': (r) => r.timings.duration < 500,
        'performance - CSS accessible': (r) => r.status === 200,
    });

    sleep(0.3);

    // Step 3: Load critical JavaScript (simulating script loading)
    const jsResponse = http.get(`${BASE_URL}/_app/immutable/entry/start.865d8e2a.js`);
    check(jsResponse, {
        'performance - JS loads fast': (r) => r.timings.duration < 800,
        'performance - JS accessible': (r) => r.status === 200,
    });

    sleep(0.3);

    // Step 4: Simulate user interactions (multiple page visits)
    for (let i = 0; i < 5; i++) {
        const interactionResponse = http.get(`${BASE_URL}/`);
        check(interactionResponse, {
            ['performance - interaction ' + (i + 1) + ' fast']: (r) => r.timings.duration < 1000,
            ['performance - interaction ' + (i + 1) + ' successful']: (r) => r.status === 200,
        });
        sleep(Math.random() * 0.5 + 0.2);
    }

    // Step 5: Load additional assets (simulating full page load)
    const assets = [
        '/images/pizza.png',
        '/_app/immutable/assets/4.1bdb0f28.css',
        '/_app/immutable/chunks/index.98b0eb20.js'
    ];

    for (const asset of assets) {
        const assetResponse = http.get(`${BASE_URL}${asset}`);
        check(assetResponse, {
            ['performance - ' + asset + ' loads']: (r) => r.status === 200,
            ['performance - ' + asset + ' fast']: (r) => r.timings.duration < 1000,
        });
    }

    const endTime = new Date().getTime();
    const pageLoadDuration = endTime - startTime;

    // Simulate realistic user think time
    sleep(Math.random() * 3 + 1);
}

export function setup() {
    console.log('⚡ Starting frontend performance test for QuickPizza...');
    console.log('🎯 Testing complete page load and user interaction flow');
}

export function teardown() {
    console.log('✅ Frontend performance test completed.');
}