export class User {
  constructor(
    public id?: any,
    public username?: string,
    public password?: string,
    public firstName?: string,
    public lastName?: string,
    public roles?: [string],
    public old_password?: string,
  ) {
  }
}
