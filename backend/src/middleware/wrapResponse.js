export const wrapResponse = (req, res, next) => {
    const originalJson = res.json.bind(res);
    res.json = (data) => {
        //Validate the correct structure 
        if (
            data?.Error ||
            data?.Response === "False" ||
            res.statusCode >= 400
        ) {
            return originalJson(data);
        }
        // If not send with correct structure
        return originalJson({
            success: true,
            data,
            timestamp: new Date().toISOString(),
        });
    };

    next();
};
