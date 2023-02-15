import assert from 'assert'
import axios from 'axios'
import { FAKER } from '../utils/fakerProduct.utils.js'

//TEST de AXIOS
const API_URL = "http://localhost:8080/api/"

async function axiosLogin(user){
    const response = await axios.post(API_URL+'auth/login',user)
    return response
    
}
async function axiosRegister(newUser){
    const response = await axios.post(API_URL+'auth/register',newUser)
    return response
}
async function axiosDelete(user){
    const response = await axios.delete(API_URL+'usuarios/'+user.id)
    return response
}
async function axiosNewProduct(product){
    const response = await axios.post(API_URL+'productos/',product)
    return response
}
async function axiosEditProduct(product){
    const editedProduct = {
        title: product.title,
        description: product.description,
        code: product.code,
        thumbnail: product.thumbnail,
        price: product.price,
        stock: product.stock
    }
    const response = await axios.put(API_URL+'productos/'+product.id,editedProduct)
    return response
}
async function axiosDeleteProduct(product){
    const response = await axios.delete(API_URL+'productos/'+product.id)
    return response
}


// const Rafa = {"email":"rafael.msl81@gmail.com", "password":"0909"}


describe("success path new user", function () {
    this.timeout(5000);

    before(function () {
        console.log('\n********* Comienzo TOTAL de Test *********')
    })
    after(function () {
        console.log('\n********* Fin TOTAL de Test *********')
    })

    const fakeUser = FAKER.createFakeUser()

    it('debería registar un usuario', async function () {
        const response = await axiosRegister(fakeUser)
        assert.strictEqual(fakeUser.email,response.data.user.email) 
    })

    it('debería loguear un usuario', async function () {
        const loginUser = {
            "email":fakeUser.email,
            "password":fakeUser.password
        }
        const response = await axiosLogin(loginUser)
        assert.strictEqual(response.data.user.email,loginUser.email)
        fakeUser.id = response.data.user._id 
    })
    it('deberia borrar un usuario', async function(){
        const response = await axiosDelete(fakeUser)
        assert.strictEqual(response.data.success,true)
    })
})

describe("success path new product", function () {
    this.timeout(5000);

    before(function () {
        console.log('\n********* Comienzo TOTAL de Test *********')
    })
    after(function () {
        console.log('\n********* Fin TOTAL de Test *********')
    })

    const fakeProduct = FAKER.createFakeProduct()

    it('debería crear un producto', async function () {
        const response = await axiosNewProduct(fakeProduct)
        assert.strictEqual(fakeProduct.thumbnail,response.data.thumbnail) 
        fakeProduct.id = response.data.id
    })
    it('debería editar un producto', async function () {
        fakeProduct.price = fakeProduct.price * 2
        const response = await axiosEditProduct(fakeProduct)
        assert.strictEqual(fakeProduct.price,response.data.price) 
    })
    it('debería borrar un producto', async function () {
        const response = await axiosDeleteProduct(fakeProduct)
        assert.strictEqual(response.data.success,true) 
    })

    
})

