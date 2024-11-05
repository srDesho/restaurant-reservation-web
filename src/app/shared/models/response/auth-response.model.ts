import { Profile } from "./profile-response.model";

export interface AuthResponse {
    token: string;
    user:  Profile;
}
