# Async Retry Utility

A lightweight utility to retry promise-based functions with customizable retry logic.

## Installation

```bash
npm install async-retry-util
```

## Usage

```javascript
import { asyncRetry } from "async-retry-util";

async function unstableFunction() {
  if (Math.random() > 0.7) {
    return "Success!";
  }
  throw new Error("Failed attempt");
}

(async () => {
  const result = await asyncRetry(unstableFunction, {
    retries: 5,
    delay: 1000,
    onRetry: (attempt, error) => {
      console.log(`Attempt ${attempt} failed: ${error.message}`);
    },
  });
  console.log(result);
})();
```

## Options

- **retries**: Number of retry attempts (default: 3)..
- **delay**: Delay between retries in milliseconds (default: 1000ms). 
- **onRetry**: Callback invoked on each retry with the attempt number and error.

