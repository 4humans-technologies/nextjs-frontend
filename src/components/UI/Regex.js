export const validEmail = new RegExp(
  "^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$"
);
export const validPassword = new RegExp("^(?=.*?[A-Za-z])(?=.*?[0-9]).{6,}$");
export const validatePhone = new RegExp(
  "^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$"
);
