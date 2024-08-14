export interface Encrypter {
  encpryt: (password: string) => Promise<string>
}
