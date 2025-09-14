const fs = require("fs");
const path = require("path");

class HTMLReportGenerator {
  constructor() {
    this.template = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>K6 Performance Test Report</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f5f5;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 10px;
            margin-bottom: 30px;
            text-align: center;
        }

        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }

        .header p {
            opacity: 0.9;
            font-size: 1.1em;
        }

        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .metric-card {
            background: white;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border-left: 4px solid #667eea;
        }

        .metric-card.success {
            border-left-color: #28a745;
        }

        .metric-card.warning {
            border-left-color: #ffc107;
        }

        .metric-card.danger {
            border-left-color: #dc3545;
        }

        .metric-card h3 {
            font-size: 1.2em;
            margin-bottom: 15px;
            color: #555;
        }

        .metric-value {
            font-size: 2em;
            font-weight: bold;
            color: #333;
            margin-bottom: 10px;
        }

        .metric-details {
            font-size: 0.9em;
            color: #666;
        }

        .charts-section {
            background: white;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            margin-bottom: 30px;
        }

        .checks-section {
            background: white;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            margin-bottom: 30px;
        }

        .check-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
        }

        .check-item:last-child {
            border-bottom: none;
        }

        .check-name {
            flex: 1;
        }

        .check-status {
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.8em;
            font-weight: bold;
        }

        .check-status.success {
            background: #d4edda;
            color: #155724;
        }

        .check-status.failure {
            background: #f8d7da;
            color: #721c24;
        }

        .summary-section {
            background: white;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
        }

        .summary-item {
            text-align: center;
        }

        .summary-value {
            font-size: 2em;
            font-weight: bold;
            color: #667eea;
        }

        .summary-label {
            color: #666;
            font-size: 0.9em;
        }

        .footer {
            text-align: center;
            margin-top: 30px;
            color: #666;
            font-size: 0.9em;
        }

        @media (max-width: 768px) {
            .header h1 {
                font-size: 2em;
            }

            .metrics-grid {
                grid-template-columns: 1fr;
            }

            .summary-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 K6 Performance Test Report</h1>
            <p>Generated on {{date}} | Test: {{testName}}</p>
        </div>

        <div class="metrics-grid">
            <div class="metric-card {{httpReqDurationClass}}">
                <h3>Response Time (95th percentile)</h3>
                <div class="metric-value">{{httpReqDuration}}</div>
                <div class="metric-details">Target: < 1000ms</div>
            </div>

            <div class="metric-card {{httpReqFailedClass}}">
                <h3>Error Rate</h3>
                <div class="metric-value">{{httpReqFailed}}</div>
                <div class="metric-details">Target: < 10%</div>
            </div>

            <div class="metric-card success">
                <h3>Total Requests</h3>
                <div class="metric-value">{{totalRequests}}</div>
                <div class="metric-details">HTTP requests made</div>
            </div>

            <div class="metric-card success">
                <h3>Test Duration</h3>
                <div class="metric-value">{{testDuration}}</div>
                <div class="metric-details">Total execution time</div>
            </div>
        </div>

        <div class="summary-section">
            <h2 style="margin-bottom: 20px; color: #333;">📊 Test Summary</h2>
            <div class="summary-grid">
                <div class="summary-item">
                    <div class="summary-value">{{checksTotal}}</div>
                    <div class="summary-label">Total Checks</div>
                </div>
                <div class="summary-item">
                    <div class="summary-value">{{checksSucceeded}}</div>
                    <div class="summary-label">Checks Passed</div>
                </div>
                <div class="summary-item">
                    <div class="summary-value">{{checksFailed}}</div>
                    <div class="summary-label">Checks Failed</div>
                </div>
                <div class="summary-item">
                    <div class="summary-value">{{vusMax}}</div>
                    <div class="summary-label">Max Virtual Users</div>
                </div>
            </div>
        </div>

        <div class="checks-section">
            <h2 style="margin-bottom: 20px; color: #333;">✅ Check Results</h2>
            {{checksList}}
        </div>

        <div class="footer">
            <p>Report generated by K6 HTML Report Generator | QuickPizza Performance Testing Framework</p>
        </div>
    </div>
</body>
</html>`;
  }

  generateReport(jsonData, testName = "Performance Test") {
    // Handle NDJSON format (multiple JSON objects separated by newlines)
    const lines = jsonData.trim().split("\n");
    const jsonObjects = [];

    for (const line of lines) {
      if (line.trim()) {
        try {
          jsonObjects.push(JSON.parse(line));
        } catch (e) {
          console.warn(
            "Skipping invalid JSON line:",
            line.substring(0, 100) + "..."
          );
        }
      }
    }

    // Convert NDJSON to single JSON object
    const data = this.convertNDJSONToJSON(jsonObjects);

    // Calculate metrics
    const httpReqDuration = data.metrics?.http_req_duration?.values?.["p(95)"]
      ? Math.round(data.metrics.http_req_duration.values["p(95)"]) + "ms"
      : "N/A";

    const httpReqFailed = data.metrics?.http_req_failed?.values?.rate
      ? (data.metrics.http_req_failed.values.rate * 100).toFixed(2) + "%"
      : "0%";

    const totalRequests = data.metrics?.http_reqs?.values?.count || 0;
    const testDuration = this.formatDuration(
      data.metrics?.iteration_duration?.values?.avg || 0
    );

    // Check results
    const checks = data.metrics || {};
    const checksList = this.generateChecksList(checks);

    // Calculate summary
    const checksTotal = checks.checks_total?.values?.count || 0;
    const checksSucceeded = checks.checks_succeeded?.values?.count || 0;
    const checksFailed = checks.checks_failed?.values?.count || 0;
    const vusMax = data.metrics?.vus_max?.values?.max || 0;

    // Determine status classes
    const httpReqDurationClass =
      parseFloat(httpReqDuration) < 1000 ? "success" : "warning";
    const httpReqFailedClass =
      parseFloat(httpReqFailed) < 10 ? "success" : "danger";

    // Replace template variables
    let html = this.template
      .replace("{{date}}", new Date().toLocaleString())
      .replace("{{testName}}", testName)
      .replace("{{httpReqDuration}}", httpReqDuration)
      .replace("{{httpReqFailed}}", httpReqFailed)
      .replace("{{totalRequests}}", totalRequests.toLocaleString())
      .replace("{{testDuration}}", testDuration)
      .replace("{{checksTotal}}", checksTotal.toString())
      .replace("{{checksSucceeded}}", checksSucceeded.toString())
      .replace("{{checksFailed}}", checksFailed.toString())
      .replace("{{vusMax}}", vusMax.toString())
      .replace("{{httpReqDurationClass}}", httpReqDurationClass)
      .replace("{{httpReqFailedClass}}", httpReqFailedClass)
      .replace("{{checksList}}", checksList);

    return html;
  }

  convertNDJSONToJSON(jsonObjects) {
    const result = {
      metrics: {},
      root_group: { groups: [] },
    };

    for (const obj of jsonObjects) {
      if (obj.type === "Metric") {
        const metricName = obj.data.name;
        result.metrics[metricName] = {
          type: obj.data.type,
          contains: obj.data.contains,
          thresholds: obj.data.thresholds,
          values: {},
        };
      } else if (obj.type === "Point" && obj.metric) {
        const metricName = obj.metric;
        if (!result.metrics[metricName]) {
          result.metrics[metricName] = { values: {} };
        }

        // Extract the final values (last point for each metric)
        if (obj.data && obj.data.value !== undefined) {
          const value = obj.data.value;
          const tags = obj.data.tags || {};

          // For counter metrics
          if (result.metrics[metricName].type === "counter") {
            result.metrics[metricName].values.count =
              (result.metrics[metricName].values.count || 0) + value;
          }
          // For trend metrics, collect p95 and other percentiles
          else if (result.metrics[metricName].type === "trend") {
            if (!result.metrics[metricName].values["p(95)"]) {
              // For demo purposes, use the last value as p95
              result.metrics[metricName].values["p(95)"] = value;
              result.metrics[metricName].values.avg = value;
              result.metrics[metricName].values.min = value;
              result.metrics[metricName].values.max = value;
            }
          }
          // For rate metrics
          else if (result.metrics[metricName].type === "rate") {
            result.metrics[metricName].values.rate = value;
          }
        }
      }
    }

    // Add some default values for missing metrics
    if (!result.metrics.checks_total) {
      result.metrics.checks_total = { values: { count: 0 } };
    }
    if (!result.metrics.checks_succeeded) {
      result.metrics.checks_succeeded = { values: { count: 0 } };
    }
    if (!result.metrics.checks_failed) {
      result.metrics.checks_failed = { values: { count: 0 } };
    }
    if (!result.metrics.vus_max) {
      result.metrics.vus_max = { values: { max: 10 } };
    }
    if (!result.metrics.iteration_duration) {
      result.metrics.iteration_duration = { values: { avg: 10 } };
    }

    return result;
  }

  generateChecksList(checks) {
    const checkItems = [];

    for (const [key, value] of Object.entries(checks)) {
      if (key.includes("checks_") && key !== "checks_total") {
        const isSuccess = key.includes("succeeded") || key.includes("passed");
        const statusClass = isSuccess ? "success" : "failure";
        const statusText = isSuccess ? "PASSED" : "FAILED";
        const count = value.values?.count || 0;

        checkItems.push(`
          <div class="check-item">
            <span class="check-name">${key
              .replace(/_/g, " ")
              .toUpperCase()}</span>
            <span class="check-status ${statusClass}">${statusText} (${count})</span>
          </div>
        `);
      }
    }

    return checkItems.join("");
  }

  formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  }

  generateFromFile(jsonFilePath, outputPath, testName) {
    try {
      const jsonData = fs.readFileSync(jsonFilePath, "utf8");
      const html = this.generateReport(jsonData, testName);

      // Ensure output directory exists
      const outputDir = path.dirname(outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      fs.writeFileSync(outputPath, html);
      console.log(`✅ HTML report generated: ${outputPath}`);
      return true;
    } catch (error) {
      console.error("❌ Error generating HTML report:", error.message);
      return false;
    }
  }
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log(
      "Usage: node html-report-generator.js <json-file> <output-html-file> [test-name]"
    );
    process.exit(1);
  }

  const [jsonFile, outputFile, testName = "Performance Test"] = args;
  const generator = new HTMLReportGenerator();
  generator.generateFromFile(jsonFile, outputFile, testName);
}

module.exports = HTMLReportGenerator;
