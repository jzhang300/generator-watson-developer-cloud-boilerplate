'use strict';

module.exports = {
  VCAP_SERVICES: JSON.stringify({
    service_name_id: [{
      credentials: {
        url: '<url>',
        username: '<username>',
        password: '<password>'
      }
    }]
  }),
  VCAP_APP_PORT: 3000
};