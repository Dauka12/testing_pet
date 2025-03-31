// Toggle this to true to use mock data instead of real API calls
export const DEMO_MODE = true;

// Demo delay to simulate network latency (in ms)
export const DEMO_DELAY = 800;

// Utility function to simulate API delay
export const simulateDelay = async (): Promise<void> => {
    if (DEMO_MODE) {
        return new Promise(resolve => setTimeout(resolve, DEMO_DELAY));
    }
    return Promise.resolve();
};