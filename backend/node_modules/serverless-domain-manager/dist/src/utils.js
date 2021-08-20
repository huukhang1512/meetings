"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.throttledCall = exports.getAWSPagedResults = exports.sleep = void 0;
const RETRYABLE_ERRORS = ["Throttling", "RequestLimitExceeded", "TooManyRequestsException"];
/**
 * Iterate through the pages of a AWS SDK response and collect them into a single array
 *
 * @param service - The AWS service instance to use to make the calls
 * @param funcName - The function name in the service to call
 * @param resultsKey - The key name in the response that contains the items to return
 * @param nextTokenKey - The request key name to append to the request that has the paging token value
 * @param nextRequestTokenKey - The response key name that has the next paging token value
 * @param params - Parameters to send in the request
 */
function getAWSPagedResults(service, funcName, resultsKey, nextTokenKey, nextRequestTokenKey, params) {
    return __awaiter(this, void 0, void 0, function* () {
        let results = [];
        let response = yield throttledCall(service, funcName, params);
        results = results.concat(response[resultsKey]);
        while (response.hasOwnProperty(nextRequestTokenKey) && response[nextRequestTokenKey]) {
            params[nextTokenKey] = response[nextRequestTokenKey];
            response = yield service[funcName](params).promise();
            results = results.concat(response[resultsKey]);
        }
        return results;
    });
}
exports.getAWSPagedResults = getAWSPagedResults;
function throttledCall(service, funcName, params) {
    return __awaiter(this, void 0, void 0, function* () {
        const maxTimePassed = 5 * 60;
        let timePassed = 0;
        let previousInterval = 0;
        const minWait = 3;
        const maxWait = 60;
        while (true) {
            try {
                return yield service[funcName](params).promise();
            }
            catch (ex) {
                // rethrow the exception if it is not a type of retryable exception
                if (RETRYABLE_ERRORS.indexOf(ex.code) === -1) {
                    throw ex;
                }
                // rethrow the exception if we have waited too long
                if (timePassed >= maxTimePassed) {
                    throw ex;
                }
                // Sleep using the Decorrelated Jitter algorithm recommended by AWS
                // https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/
                let newInterval = Math.random() * Math.min(maxWait, previousInterval * 3);
                newInterval = Math.max(minWait, newInterval);
                yield sleep(newInterval);
                previousInterval = newInterval;
                timePassed += previousInterval;
            }
        }
    });
}
exports.throttledCall = throttledCall;
/**
 * Stops event thread execution for given number of seconds.
 * @param seconds
 * @returns {Promise<void>} Resolves after given number of seconds.
 */
function sleep(seconds) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => setTimeout(resolve, 1000 * seconds));
    });
}
exports.sleep = sleep;
