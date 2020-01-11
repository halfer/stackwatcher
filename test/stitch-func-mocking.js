function StitchFuncMocking() {
    // Properties
    this.globalMocks = {};

    this.setGlobalMock = function(funcName, func) {
        this.globalMocks[funcName] = func;
    };

    this.getFunctionsObject = function(jest) {
        return {
            execute: jest.fn((funcName, ...params) => {
                if (this.globalMocks[funcName] == undefined) {
                    throw new Error(`Mock function '${funcName}' not defined`);
                }
                // This calls a mock that we set up per test
                return this.globalMocks[funcName](...params);
            })
        };
    };
}

module.exports = StitchFuncMocking;
