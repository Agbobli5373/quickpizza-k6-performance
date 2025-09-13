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

2. Run the load test:
   ```bash
   npm run run-test
   ```

This will compile the TypeScript code and execute the K6 test, generating a JSON report in the `reports/` directory.

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
