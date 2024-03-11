export class Util {
  checkIsEmail(email: string) {
    const regexExp =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;
    return regexExp.test(email);
  }

  compareDate(smallDate: any, bigDate: any) {
    const small = new Date(smallDate);
    const big = new Date(bigDate);
    if (small.getFullYear() > big.getFullYear()) {
      return false;
    }
    if (small.getMonth() > big.getMonth()) {
      return false;
    } else if (small.getMonth() < big.getMonth()) {
      return true;
    } else {
      if (small.getDate() < big.getDate()) {
        return true;
      }
      return false;
    }
  }
}
