import { IsString, MaxLength, IsNotEmpty } from "class-validator";

export class LabyrinthDto {
    @IsString({ message: 'name must be a string' })
    @MaxLength(30)
    @IsNotEmpty()
    name: string;
}