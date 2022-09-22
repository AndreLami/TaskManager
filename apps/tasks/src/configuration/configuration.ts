export default () => {
    return {
        envFilePath: `.${process.env.APP_ENV.toLowerCase()}.tasks.env`,
    };
};
