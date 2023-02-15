import faker from 'faker'

faker.locale = "es";

const generarProducto = () => ({
    titulo: faker.hacker.phrase(),
    cuerpo: faker.lorem.paragraph(),
    autor: faker.name.findName(),
    imagen: faker.image.avatar(),
    email: faker.internet.email(),
    vista: false
})
 
export default generarProducto