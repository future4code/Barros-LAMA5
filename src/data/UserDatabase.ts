import { BaseDatabase } from "./BaseDatabase";
import { User } from "../model/User";

export class UserDatabase extends BaseDatabase {

  private static TABLE_NAME = "LAMA_Users";

  public createUser = async (
    id: string,
    email: string,
    name: string,
    password: string,
    role: string
    ): Promise<void> => {
    try {

      await this.getConnection()
        .insert({
          id,
          email,
          name,
          password,
          role
        })
        .into(UserDatabase.TABLE_NAME);

    } catch (error:any) {
      throw new Error(error.sqlMessage || error.message);
    }
  };

  public getUserByEmail = async (email: string): Promise<User | null> => {
    const result = await this.getConnection()
      .select("*")
      .from(UserDatabase.TABLE_NAME)
      .where({ email });

    if (result.length < 1) {
      return null
    }

    return User.toUserModel(result[0]);
  };
}
