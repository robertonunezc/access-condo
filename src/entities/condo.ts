interface CondoInterface{
    name: string;
    address: string;
}

export class Condo implements CondoInterface {
    constructor(
        public name: string,
        public address: string,
    ) {}
}