// representación de lo que se guarda en la tabla (mysql) o colección (mongoDb)
// se definen las reglas de negocio de guardado de datos. registros de la base de datos.
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"

@Schema()  // decorador para el esquema de base de datos
export class Pokemon extends Document{

    //is: string // lo da mongo
    @Prop({
        unique:true,
        index:true,
    })
    name: string

    @Prop({
        unique:true,
        index:true,
    })
    nro: number
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon)