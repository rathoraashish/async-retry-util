import { asyncRetry } from "../src/index";

describe("asyncRetry Utility", () => {
  it("should retry the specified number of times and eventually succeed", async () => {
    let attempts = 0;

    const mockFunction = jest.fn(async () => {
      attempts++;
      if (attempts < 3) {
        throw new Error("Failed attempt");
      }
      return "Success";
    });

    const result = await asyncRetry(mockFunction, { retries: 5, delay: 10 });

    expect(result).toBe("Success");
    expect(mockFunction).toHaveBeenCalledTimes(3);
  });

  it("should throw an error after all retries fail", async () => {
    const mockFunction = jest.fn(async () => {
      throw new Error("Always fails");
    });

    await expect(asyncRetry(mockFunction, { retries: 3, delay: 10 })).rejects.toThrow(
      "Always fails"
    );
    expect(mockFunction).toHaveBeenCalledTimes(3);
  });

  it("should call onRetry callback on each retry", async () => {
    const mockFunction = jest.fn(async () => {
      throw new Error("Fails");
    });

    const onRetryMock = jest.fn();

    await expect(
      asyncRetry(mockFunction, { retries: 2, delay: 10, onRetry: onRetryMock })
    ).rejects.toThrow("Fails");

    expect(onRetryMock).toHaveBeenCalledTimes(1);
    expect(onRetryMock).toHaveBeenCalledWith(1, expect.any(Error));
  });
});
