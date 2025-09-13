import http from 'k6/http';
import { check, sleep } from 'k6';

// Test configuration
export let options = {
  vus: 10, // Number of virtual users
  duration: '30s', // Test duration

  thresholds: {
    http_req_duration: ['p(95)<1000'], // 95% of requests should be below 1000ms
    http_req_failed: ['rate<0.1'], // Error rate should be below 10%
  },
};

const BASE_URL = __ENV.BASE_URL || 'https://quickpizza.grafana.com';

export default function () {
  // Scenario 1: Homepage load test
  let response = http.get(`${BASE_URL}/`);

  check(response, {
    'homepage status is 200': (r) => r.status === 200,
    'homepage response time < 1000ms': (r) => r.timings.duration < 1000,
    'homepage contains pizza content': (r) => !!(r.body && typeof r.body === 'string' && (r.body.includes('pizza') || r.body.includes('Pizza') || r.body.includes('QuickPizza'))),
    'homepage has proper HTML structure': (r) => !!(r.body && typeof r.body === 'string' && r.body.includes('<html')),
  });

  sleep(Math.random() * 2 + 1);

  // Scenario 2: Test static assets loading
  const assets = [
    '/images/pizza.png',
    '/_app/immutable/assets/0.56795cc5.css',
    '/_app/immutable/assets/4.1bdb0f28.css'
  ];

  for (const asset of assets) {
    const assetResponse = http.get(`${BASE_URL}${asset}`);
    check(assetResponse, {
      [`asset ${asset} loads`]: (r) => r.status === 200,
      [`asset ${asset} response time < 500ms`]: (r) => r.timings.duration < 500,
    });
  }

  sleep(Math.random() * 1.5 + 0.5);

  // Scenario 3: Test JavaScript modules loading
  const jsModules = [
    '/_app/immutable/entry/start.865d8e2a.js',
    '/_app/immutable/chunks/index.98b0eb20.js'
  ];

  for (const module of jsModules) {
    const moduleResponse = http.get(`${BASE_URL}${module}`);
    check(moduleResponse, {
      [`JS module ${module} loads`]: (r) => r.status === 200,
      [`JS module ${module} response time < 800ms`]: (r) => r.timings.duration < 800,
    });
  }

  sleep(Math.random() * 2 + 1);

  // Scenario 4: Simulate user interaction patterns
  // Multiple rapid requests to simulate user browsing
  for (let i = 0; i < 3; i++) {
    const browseResponse = http.get(`${BASE_URL}/`);
    check(browseResponse, {
      [`browse request ${i + 1} successful`]: (r) => r.status === 200,
      [`browse request ${i + 1} fast`]: (r) => r.timings.duration < 1000,
    });
    sleep(Math.random() * 1 + 0.5);
  }

  sleep(Math.random() * 3 + 2);
}

// Setup function - runs before the test starts
export function setup() {
  console.log('🍕 Starting QuickPizza frontend load test...');
  console.log(`🎯 Target URL: ${BASE_URL}`);
  console.log('📊 Testing homepage, assets, and user interaction patterns');

  // Warm-up request
  const warmupResponse = http.get(`${BASE_URL}/`);
  if (warmupResponse.status !== 200) {
    console.warn('⚠️  Warm-up request failed, service might not be ready');
  } else {
    console.log('✅ QuickPizza demo is ready for testing');
  }
}

// Teardown function - runs after the test ends
export function teardown() {
  console.log('🏁 QuickPizza frontend load test completed.');
  console.log('📈 Check reports/ for detailed results');
}