
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import UsuariosAPI from './GraphQLApi.js';

const schema = buildSchema(`
  input UsuarioInput {
    email: String,
    password: String,
    telefono: String,
    nacimiento: String,
    direccion: String
  }
  
  type Usuario {
    _id: ID!
    email: String,
    password: String,
    telefono: String,
    nacimiento: String,
    direccion: String,
    timestamp: String
  }
  type Query {
    getUsuarios: [Usuario],
  }
  type Mutation {
    deleteUsuario(_id: ID!): Usuario,
  }
`);


export default class GraphQLController {
    constructor() {
        const api = new UsuariosAPI()
        return graphqlHTTP({
            schema: schema,
            rootValue: {
              getUsuarios: api.getUsuarios, 
              deleteUsuario : api.deleteUsuario},
            graphiql: true,
        })
    }
}
