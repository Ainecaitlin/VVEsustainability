var UserSessionMock = function () {
    this.err = false;
    this.numberAffected = 0;
};

UserSessionMock.prototype.setError = function (err) {
    this.err = err;
};

UserSessionMock.prototype.setNumberAffected = function (number) {
    this.numberAffected = number;
};

UserSessionMock.prototype.save = function (callback) {
    this.numberAffected = 1;
    return callback(this.err, this, this.numberAffected);
};

module.exports = UserSessionMock;