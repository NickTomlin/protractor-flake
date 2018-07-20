declare namespace NodeJS {
  interface Global {
    expect: any
    sandbox: any
    sinon: any
  }
}

declare function expect(expectation: any): any;
