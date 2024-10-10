export const handleAxiosError = (service: any, error: any) => {
    console.error(`Error in ${service} service:`, error.message);
    if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
    }
    // You can choose to return a default value or rethrow the error
    // return null; // or some default value
    throw error; // or rethrow to stop the entire process
};
