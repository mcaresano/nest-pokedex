import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http:AxiosAdapter
  ) {}

  async executeSeed() {
    await this.pokemonModel.deleteMany({});
    const  data:PokeResponse  = await this.http.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon/?limit=650',
    );
    /*
    //const insertPromisesArray =[]

    data.results.forEach(async({ name, url }) => {
      const segments = url.split('/');
      const nro: number = +segments[segments.length - 2];
      //const pokemon = await this.pokemonModel.create({ name, nro })

      // mejora el proceso para cargar mas datos
      insertPromisesArray.push(
        this.pokemonModel.create({name, nro})
      )
      console.log({ name, nro });
    });
    const newArray = await Promise.all(insertPromisesArray)
    */
    // mejor forma
    const pokemonToInsert: { name: string; nro: number }[] = [];

    data.results.forEach(async ({ name, url }) => {
      const segments = url.split('/');
      const nro: number = +segments[segments.length - 2];
      pokemonToInsert.push({ name, nro });
    });
    await this.pokemonModel.insertMany(pokemonToInsert);

    return `Seed executed`;
  }
}
