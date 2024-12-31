export interface RetryOptions {
    retries?: number;
    delay?: number; // delay between retries in milliseconds
    onRetry?: (attempt: number, error: any) => void;
}

export async function asyncRetry<T>(
    fn: () => Promise<T>,
    options: RetryOptions = {}
): Promise<T> {
    const { retries = 3, delay = 1000, onRetry } = options;

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            if (attempt < retries) {
                if (onRetry) onRetry(attempt, error);
                await new Promise((resolve) => setTimeout(resolve, delay));
            } else {
                throw error;
            }
        }
    }

    throw new Error("Failed to execute the function after retries");
}
