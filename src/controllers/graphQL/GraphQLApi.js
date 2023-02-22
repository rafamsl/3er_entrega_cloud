import { UsuariosDao } from "../../dao/index.js";

export default class UsuariosAPI {
    getUsuarios = async () => {
        const users = await UsuariosDao.getAll()
        return users;
    }
    deleteUsuario = async ({_id}) => {
        const user = await UsuariosDao.getById(_id);
        await UsuariosDao.deleteById(_id);
        return user

    }

}