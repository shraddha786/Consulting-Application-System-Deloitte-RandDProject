export class Profile {
    first_name: String;
    last_name: String;
    email?: String = 'johndoe@gmail.com';
    upload_CV: Boolean;
    upload_Video?: Boolean = false;
    accepted: Boolean;
}