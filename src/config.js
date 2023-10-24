export const resolveAPI = (url) => {
    const backendUrl = `${process.env.REACT_APP_BACKEND_API_URL}/${url}`;
    return backendUrl;
}