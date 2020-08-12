// Class that provides scheduling of callbacks

const INTERVAL_TIME = 60 * 1000; // every minute

const makeScheduler = () => {
    return {
        interval: INTERVAL_TIME,
        startClock(callback) {
            setInterval(callback, this.interval);
        },
    }
};

module.exports = makeScheduler;
