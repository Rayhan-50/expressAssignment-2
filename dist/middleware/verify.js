const verify = (req, res, next) => {
    const ID = true;
    if (!ID) {
        throw new Error("Not Allowed");
    }
    next();
};
export default verify;
