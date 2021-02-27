import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { UserRepository } from "../repositories/UserRepository";
import * as yup from "yup";

class UserController {
  async create(request: Request, response: Response) {
    const { name, email } = request.body;

    //Validações
    const schema = yup.object().shape({
      name: yup.string().required(),
      email: yup.string().email().required(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({
        error: "Erro de validação",
      });
    }

    const userRepository = getCustomRepository(UserRepository);

    const userAlreadyExists = await userRepository.findOne({
      email,
    });

    //Validando se possui um usuário cadastrado com o mesmo email
    if (userAlreadyExists) {
      return response.status(400).json({
        error: "Usuário já cadastrado",
      });
    }

    const user = userRepository.create({
      name,
      email,
    });

    //Cadastrando o usuário no bd
    await userRepository.save(user);

    return response.status(201).json(user);
  }
}

export { UserController };
