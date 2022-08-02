import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';

import config from '../config/default';
import indexRouter from './index';
import agendaRouter from './agenda';
import userRouter from './user';
import employeeRouter from './employee';
import authRouter from './auth';
import masterdataRouter from './masterdata';

const url = `${config.endpoint}:${config.port}`;
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'BE api-hr-app',
      version: '1.0.0',
      description:
        'BE api hr-app',
    },
    servers: [
      {
        url,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        jwt: {
          type: "http",
          scheme: "bearer",
          in: "header",
          bearerFormat: "JWT"
        },
      }
    },
    security: [{
      jwt: []
    }],
  },
  swagger: "2.0",
  apis: ['./server/routes/*.js']
}
const options = swaggerJSDoc(swaggerOptions);

const routeInit = function (app) {
  app.use('/', indexRouter);
  app.use('/docs', swaggerUI.serve, swaggerUI.setup(options, {
    swaggerOptions: {
      requestInterceptor: function (request) {
        request.headers.Origin = url;
        return request;
      },
      url: `${url}/docs`
    }
  }));
  app.use('/api', authRouter);
  app.use('/api/v1/agenda', agendaRouter);
  app.use('/api/v1/employee', employeeRouter);
  app.use('/api/v1/user', userRouter);
  app.use('/api/v1/masterdata', masterdataRouter);
};

module.exports = routeInit;