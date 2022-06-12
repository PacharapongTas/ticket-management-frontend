const publicRuntimeConfig = require("../config/index");

export const state = () => ({
    apipath: publicRuntimeConfig.API_URL,
})