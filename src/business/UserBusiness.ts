import { UserInputDTO, LoginInputDTO } from "../model/User";
import { UserDatabase } from "../data/UserDatabase";
import { HashManager } from "../services/HashManager";
import { Authenticator } from "../services/Authenticator";
import { EmailInUse, InvalidEmail, InvalidName, InvalidPassword, MissingCredentials, MissingData, RoleNotFound, UserNotFound, WrongPassword } from "../errors/UserErrors";
import { IdGenerator } from "../services/idGenerator";
import { BaseError } from "../errors/BaseError";

export class UserBusiness {

    public createUser = async (user: UserInputDTO) => {
        try {
            if (!user.email && !user.name && !user.password && !user.role) {
                throw new MissingData()
            };
    
            if (!user.name || user.name.length < 2) {
                throw new InvalidName()
            }
    
            if (!user.email || !user.email.includes("@")) {
                throw new InvalidEmail()
            }
    
            if (!user.password || user.password.length < 6) {
                throw new InvalidPassword()
            }
    
            if (user.role.toUpperCase() !== "NORMAL" && user.role.toUpperCase() !== "ADMIN") {
                throw new RoleNotFound()
            }
    
            const userDatabase = new UserDatabase();
            const emailInUse = await userDatabase.getUserByEmail(user.email)
            if (emailInUse !== null) {
                throw new EmailInUse()
            }
    
            const idGenerator = new IdGenerator();
            const newId: string = idGenerator.generate();
    
            const hashManager = new HashManager();
            const hashPassword = await hashManager.hash(user.password);
    
            await userDatabase.createUser(newId, user.email, user.name, hashPassword, user.role);
    
            const authenticator = new Authenticator();
            const accessToken = authenticator.generateToken({ id: newId, role: user.role });
    
            return accessToken;
            
        } catch (error:any) {
            throw new BaseError(error.statusCode, error.message); 
        }
    }

    public login = async (user: LoginInputDTO) => {

        try {
            
            if (!user.email && !user.password) {
                throw new MissingCredentials();
            }
    
            if (!user.email || !user.email.includes("@")) {
                throw new InvalidEmail()
            }
    
            if (!user.password || user.password.length < 6) {
                throw new InvalidPassword()
            }
    
            const userDatabase = new UserDatabase();
            const userFromDB = await userDatabase.getUserByEmail(user.email);
    
            if (!userFromDB) {
                throw new UserNotFound();
            }
    
            const hashManager = new HashManager();
            const hashCompare = await hashManager.compare(user.password, userFromDB.getPassword());
    
            if (!hashCompare) {
                throw new WrongPassword();
            }
    
            const authenticator = new Authenticator();
            const accessToken = authenticator.generateToken({ id: userFromDB.getId(), role: userFromDB.getRole() });
    
            return accessToken;
        } catch (error:any) {
            throw new BaseError(error.statusCode, error.message); 
        };
    }
}