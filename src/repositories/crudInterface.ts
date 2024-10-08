export interface Entity {
    id?: string;
    createdAt?: Date;
    updatedAt: Date;
}

export interface CRUDInterface {
    findById(id: string): Promise<Entity | null>;
    findAll(): Promise<Entity[]>;
    create(entity: Entity): Promise<Entity>;
    update(id:string, entity: Entity): Promise<Entity>;
}