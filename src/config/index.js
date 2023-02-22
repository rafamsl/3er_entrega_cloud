import dotenv from "dotenv";
import yargs from "yargs/yargs"
dotenv.config();


const args = yargs(process.argv.slice(2)).default({mode:"FORK"}).alias({m:"mode"}).argv;

const PRODUCTS_FILENAME = "productos";
const CARTS_FILENAME = "carritos";
const config = {
  SERVER: {
    PORT: process.env.PORT,
    MODE: args.mode
  },
  DAO: process.env.DAO,
  DATABASES: {
    filesystem: {
      PRODUCTS_FILENAME,
      CARTS_FILENAME,
    },
    firebase: {
      PRODUCTS_FILENAME,
      CARTS_FILENAME,
    },
    mongo: {
      url:process.env.MONGO_URL
    }
  },
  PROCESS: {
    ARGS: args,
    PLATFORM: process.platform,
    PID: process.pid,
    PATH: process.execPath,
    MEMORY: process.memoryUsage(),
    DIR: process.cwd(),
    VERSION: process.version
  },
  CHILD: {
    RANDOM: process.env.RANDOM
  },
  CREDENTIALS:{
    adminMail: 'rafael.msl81@gmail.com',
    GMAIL:{
      gmailUser: 'rafael.msl81@gmail.com',
      gmailPass: process.env.GMAIL_PASS
    },
    ETHEREAL:{
      etherealUser: 'jordon.tillman87@ethereal.email',
      etherealPass: process.env.ETH_PASS
    },
    TWILIO:{
      accountSid: process.env.TWILIO_ACCOUNT,
      authToken: process.env.TWILIO_TOKEN,
      twilioPhone: '+13609384461'
    }
  },
  DOCS:{
    SWAGGER:{
      options:{
        definition: {
          openapi: '3.0.0',
          info: {
          title: 'Express API with Swagger',
          description:
            'A webcommerce API application documented with Swagger',
          },
        },
        apis: ['./docs/**/*.yaml'],
        }
    }
  }
};

export { config,args }