import { UserResponse } from "../../@types";
import AppError from "../../errors/AppError";
import UserRepository from "./UserRepository";

class FindUserService {
  constructor(private readonly userRepository = new UserRepository()) {}

  public async execute(id: string): Promise<UserResponse> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new AppError("user not found", 404, "USER_NOT_FOUND");
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}

export default FindUserService;
