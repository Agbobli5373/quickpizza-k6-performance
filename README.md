# K6 Performance and Load Testing Framework

This is an enterprise-ready POC for performance and load testing using K6, written in TypeScript.

## Project Structure

- `tests/`: TypeScript test scripts
- `configs/`: Environment-specific configurations (dev, staging, prod)
- `reports/`: Generated test reports and metrics
- `scripts/`: Utility scripts for running tests
- `src/`: Shared modules and utilities
- `docs/`: Additional documentation

## Prerequisites

- Node.js (v16+)
- K6 (latest)
- TypeScript

## Installation

1. Install Node.js dependencies:

   ```bash
   npm install
   ```

2. K6 is already installed in the environment.

## Building and Running Tests

1. Build TypeScript files:

   ```bash
   npm run build
   ```

2. Run tests:

   ```bash
   # Run basic load test (default)
   npm test

   # Run all test suites
   npm run test:all

   # Run specific test types
   npm run test:basic     # Basic user journey test
   npm run test:api       # API endpoint validation
   npm run test:stress    # Stress test with ramp-up
   npm run test:checkout  # Checkout performance test
   ```

## Test Scenarios

### Basic Load Test (`basic-load-test.ts`)

- Homepage browsing
- Menu API calls
- Pizza details viewing
- Drink menu browsing
- Order placement simulation

### API Validation Test (`api-validation-test.ts`)

- Validates all API endpoints
- Checks response times and status codes
- Ensures data integrity

### Stress Test (`stress-test.ts`)

- Ramp-up load testing (10 → 100 users)
- Tests system under heavy load
- Monitors performance degradation

### Checkout Performance Test (`checkout-performance-test.ts`)

- End-to-end order flow
- Payment processing simulation
- Customer data validation

## QuickPizza Demo Specific Tests

The framework is pre-configured for the QuickPizza demo application (https://quickpizza.grafana.com/) with realistic scenarios:

- **Pizza Menu Browsing**: Tests menu loading and filtering
- **Order Placement**: Simulates customer orders with various pizza/drink combinations
- **API Reliability**: Validates all endpoints under load
- **Checkout Flow**: Tests complete order processing pipeline

## Configuration

Environment-specific configurations are stored in `configs/`:

- `dev.json`: Development environment settings
- `staging.json`: Staging environment settings
- `prod.json`: Production environment settings

## Reports and Metrics

- Test results are automatically saved as JSON files in `reports/`
- Built-in K6 metrics include response times, error rates, throughput
- Thresholds are defined in the test scripts for pass/fail criteria

## Advanced Features (for Enterprise)

- **Monitoring Integration**: Can be configured to send metrics to InfluxDB/Prometheus
- **Distributed Testing**: K6 supports cloud execution for large-scale tests
- **Custom Metrics**: Add application-specific metrics in test scripts
- **CI/CD Integration**: Easily integrate into pipelines for automated testing

## Usage Examples

### Running with Custom Environment Variables

```bash
BASE_URL=https://your-app.com npm run run-test
```

### Running Specific Test

```bash
k6 run dist/tests/your-test.js
```

## Best Practices

- Define clear thresholds for performance requirements
- Use realistic test data and scenarios
- Monitor system resources during tests
- Run tests in staging before production
- Analyze trends over time with historical reports

## Contributing

1. Write tests in TypeScript in `tests/`
2. Add configurations in `configs/`
3. Update documentation in `docs/`
4. Run `npm run build` before committing

## License

ISC
