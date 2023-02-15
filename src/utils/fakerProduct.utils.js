import {faker} from "@faker-js/faker";
import { DATE_UTILS } from "./date-utils.js"
faker.locale = "es";

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

const createFakeProduct = () => {
  return {
    title:faker.commerce.productName(),
    description:faker.commerce.productDescription(),
    code:faker.commerce.product(),
    price:faker.commerce.price(),
    thumbnail:faker.image.business(),
    stock: getRandomInt(1,50),
  }
};

const createFakeUser = () => {
  return {
      name: faker.name.firstName(),
      lastname: faker.name.lastName(),
      telefono: faker.phone.imei(),
      direccion: faker.address.streetAddress(),
      nacimiento: faker.date.birthdate(),
      email: faker.internet.email(),
      password: faker.internet.password()
  }
};

export const FAKER = { createFakeProduct, createFakeUser }
