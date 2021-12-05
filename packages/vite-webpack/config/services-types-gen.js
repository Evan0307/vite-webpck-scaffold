const generateSwaggerCode = require('swagger-tscode-generate');

const settingParams = [
  {
    // swagger json data  url
    url: '',
    codegen: {
      // generated Folders
      tsType: 'src/types/services/types',
      tsControler: 'src/types/services/service',

      // Custom Request Tool
      httpBase: '~/utils/fetch',

      // rename file name more friendly
      // Sample --> SampleController
      getAPIFileName: function transformFileName(name) {
        return name.indexOf('API') ? `${name.replace(/[ ]/g, '')}Controller` : name;
      },

      // is only Create types file
      onlyCreateTypes: true,
    },
  },
];

generateSwaggerCode(settingParams);
