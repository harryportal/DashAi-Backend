import { AuthTypes, IAuthRepository } from "./auth.dto";
import { injectable, inject } from "inversify";


@injectable()
export class AuthService{
    private authRepository: IAuthRepository;
    constructor(@inject(AuthTypes.IAuthRepository)authRepository:IAuthRepository){
        this.authRepository = authRepository;
    }

    


    



}