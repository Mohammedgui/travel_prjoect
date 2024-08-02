class ExpressError extends Error {
    constructor(status,messgae) {
        super();
        this.status=status;
        this.messgae=message;
    }
}
module.exports=ExpressError;  