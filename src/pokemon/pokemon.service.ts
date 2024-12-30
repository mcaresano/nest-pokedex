import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class PokemonService {
  private defaultLimit:number
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService
  ) {
    this.defaultLimit = configService.get('defaultLimit')

  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = this.defaultLimit, offset = 0 } = paginationDto;
    return this.pokemonModel
      .find()
      .limit(limit)
      .skip(offset) // para el paginado.
      .sort({
        nro: 1, // orden ascendente
      })
      .select('-__v'); // quitamos el id de mongodb
  }

  async findOne(term: string) {
    let pokemon: Pokemon;
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ nro: term });
    }
    //  mongoID
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }
    // name
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase() });
    }

    if (!pokemon)
      throw new NotFoundException(`Pokemon with ${term} not found `);
    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);
    if (updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    try {
      await pokemon.updateOne(updatePokemonDto);
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    // Forma clasica con cualquier campo como dato
    //const pokemon = await this.findOne(id)
    //await pokemon.deleteOne()
    // validando solo por id de mongo con el pipe personalizado creado y validado por isValidObjectId de mongoose
    // si enviamos esta sola y eleiminamos uno cualquiera. nos devuelve un 200 como si hubiera existido. hay que bsucarlo primero.
    // const result = await this.pokemonModel.findByIdAndDelete(id)

    const result = await this.pokemonModel.deleteOne({ _id: id });
    const { deletedCount } = result; // se puede desestructurar directamente
    if (deletedCount === 0)
      throw new BadRequestException(`Pokemon with id "${id}" not found`);
    return result;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Data exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    throw new InternalServerErrorException(
      `Can´t send action. Check server logs`,
    );
  }
}
