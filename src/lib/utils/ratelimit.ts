export default function rateLimit<T extends (...args: any[]) => Promise<any>>(funcToCall: T, cooldownMs: number) {
    let lastPromise: Promise<{ result: Awaited<ReturnType<T>>, lastRanAt: number }> | null = null;
    let lastRanAt = 0;

    const limited = (...args: Parameters<T>) => {
        const now = Date.now();

        if (lastPromise && now - lastRanAt < cooldownMs) {
            return lastPromise; // still in cooldown
        }

        lastPromise = (async () => {
            const result = await funcToCall(...args);
            lastRanAt = Date.now();
            return { result, lastRanAt };
        })();

        return lastPromise;
    };

    limited.invalidate = () => {
        lastPromise = null;
        lastRanAt = 0;
    };

    return limited;
}
