import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision')
    .default('development'),
  DATABASE_PORT: Joi.number().port().required(),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_SCHEMA: Joi.string().required(),
  DATABASE_SYNCHRONIZE: Joi.boolean().required(),
  DATABASE_AUTO_LOAD_ENTITIES: Joi.boolean().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_ACCESS_TOKEN_EXPIRES_IN: Joi.number().required(),
  JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
  JWT_REFRESH_TOKEN_EXPIRES_IN: Joi.number().required(),
  APP_PORT: Joi.number().required(),
  APP_HOST: Joi.string().required(),
});
